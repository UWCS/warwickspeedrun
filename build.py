import os
import sys
from pipes import Template
import shutil

import markdown
from jinja2 import Environment, FileSystemLoader, Template

rendered_content = dict()

rendered_content["event_year"] = "2023"  # e.g. "2022" or "Summer 2021"
rendered_content["event_start_date"] = "Feb 2023"
rendered_content["subs_close_date"] = "1st Feb"
rendered_content["sub_close_time"] = "2023-02-01T23:59:00Z"
rendered_content["countdown_time"] = "2023-02-18T10:15:00Z"
rendered_content["event_date_range"] = "February 2023"
rendered_content["signup_link"] = "https://oengus.io/marathon/wasd-2023"
rendered_content["money_raised"] = "&#163;6,000"

env = Environment(
    loader=FileSystemLoader("templates"),
)
jinja_template = env.get_template('template.html')
dev_flag = len(sys.argv) >= 2 and sys.argv[1] == "--dev"

# Loads and renders markdown
for file_name in os.listdir("content"):
    if (md := file_name.endswith(".md")) or file_name.endswith(".html"):
        with open(os.path.join("content", file_name)) as file:
            content_md = file.read()
            if md: content_html = markdown.markdown(content_md, extensions=['extra'])
            else: content_html = content_md

            rendered_content[file_name.removesuffix(".md" if md else ".html")] = content_html

# SVG Asset injection
def svg_inject(placeholder, filename, ext=".svg"):
    if not filename.endswith(ext): filename += ext
    rendered_content[placeholder] = open(os.path.join("src", "svg", filename), "r").read()

svg_inject("wasd_keys_logo", "wasd-keys")
svg_inject("stopwatch_svg", "stopwatch")
svg_inject("uwcs_svg", "uwcs")
svg_inject("uwcs_dots_svg", "uwcs-dots")
svg_inject("esports_svg", "esports")
svg_inject("esports_centre_svg", "esports-centre")
svg_inject("su_svg", "su")
svg_inject("capsule_bg_top", "capsule-bg-top")
svg_inject("capsule_bg_event", "capsule-bg-event")
svg_inject("schedule_svg", "schedule")

for i in range(6):
    svg_inject(f"howto{i}", os.path.join("howto", f"howto{i}"))

# Load the JS for injection into the template
rendered_content["javascript"] = open(os.path.join("src", "js", "site.js"), "r").read()


path = os.path.join("build", "dist")
if os.path.exists("build"): 
    shutil.rmtree("build")
os.makedirs("build")

with open(os.path.join("build", "index.html"), mode="w") as out_file:
    # Recursive render
    content = jinja_template.render(**rendered_content)
    while True:
        new_content = Template(content).render(**rendered_content)
        if new_content == content: break
        content = new_content

    # Remove development mode content from the template
    if not dev_flag:
        content = content.replace('http://localhost:8080', 'https://warwickspeed.run')

    out_file.write(content)

shutil.copytree("resources", os.path.join("build", "dist"))
