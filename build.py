import os
from pipes import Template
import shutil

import markdown
from jinja2 import Environment, FileSystemLoader, Template

rendered_content = dict()
env = Environment(
    loader=FileSystemLoader("templates"),
)
jinja_template = env.get_template('template.html')
dev_flag = 'DEV' in os.environ

# Loads and renders markdown
for file_name in os.listdir("content"):
    if file_name.endswith(".md"):
        with open(os.path.join("content", file_name)) as file:
            content_md = file.read()
            content_html = markdown.markdown(content_md, extensions=['extra'])

            rendered_content[file_name.strip(".md")] = content_html

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

# Load the JS for injection into the template
rendered_content["javascript"] = open(os.path.join("src", "js", "site.js"), "r").read()


rendered_content["event_year"] = "2022"  # e.g. "2022" or "Summer 2021"
rendered_content["event_start_date"] = "18th June 2022"
rendered_content["event_date_range"] = "18-20th June 2022"
rendered_content["signup_link"] = "https://oengus.io/marathon/wasd-2022"
rendered_content["money_raised"] = "&#163;6,000"

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
