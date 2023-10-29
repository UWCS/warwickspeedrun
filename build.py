import os
import shutil
import sys

import markdown
from jinja2 import Environment, FileSystemLoader, Template

rendered_content = dict()

rendered_content["event_year"] = "2024"  # e.g. "2022" or "Summer 2021"
rendered_content["event_start_date"] = "3rd Feb 2024"
rendered_content["subs_close_date"] = "8th Jan"
rendered_content["sub_close_time"] = "2024-01-08T23:59:00Z"
rendered_content["countdown_time"] = "2024-02-03T10:00:00Z"
rendered_content["end_time"] = "2024-02-14T19:00:00Z"
rendered_content["event_date_range"] = "3-4th Feb 2024"
rendered_content["signup_link"] = "https://oengus.fun/wasd2024"
rendered_content["money_raised"] = "&#163;9,000"

env = Environment(
    loader=FileSystemLoader("templates"),
)
dev_flag = len(sys.argv) >= 2 and sys.argv[1] == "--dev"

# Loads and renders markdown
for base in ["content", "templates/parts"]:
    for file_name in os.listdir(base):
        if (md := file_name.endswith(".md")) or file_name.endswith(".html"):
            with open(os.path.join(base, file_name)) as file:
                content_md = file.read()
                if md:
                    content_html = markdown.markdown(content_md, extensions=["extra"])
                else:
                    content_html = content_md

                rendered_content[
                    file_name.removesuffix(".md" if md else ".html")
                ] = content_html


# SVG Asset injection
def svg_inject(placeholder, filename, ext=".svg"):
    if not filename.endswith(ext):
        filename += ext
    rendered_content[placeholder] = open(
        os.path.join("src", "svg", filename), "r"
    ).read()


svg_inject("wasd_keys_logo", "wasd-keys")
svg_inject("stopwatch_svg", "stopwatch")
svg_inject("uwcs_svg", "uwcs")
svg_inject("uwcs_dots_svg", "uwcs-dots")
svg_inject("esports_svg", "esports")
svg_inject("esports_centre_svg", "esports-centre")
svg_inject("su_svg", "su")

for i in range(6):
    svg_inject(f"howto{i}", os.path.join("howto", f"howto{i}"))

# Load the JS for injection into the template
rendered_content["javascript"] = open(os.path.join("src", "js", "site.js"), "r").read()

if os.path.exists("build"):
    shutil.rmtree("build")
os.makedirs("build")

for file_name in os.listdir("templates"):
    if os.path.isdir(os.path.join("templates", file_name)):
        continue
    with open(os.path.join("build", file_name), mode="w") as out_file:
        # Recursive render
        jinja_template = env.get_template(file_name)
        content = jinja_template.render(**rendered_content)
        while True:
            new_content = Template(content).render(**rendered_content)
            if new_content == content:
                break
            content = new_content

        # Remove development mode content from the template
        if not dev_flag:
            content = content.replace(
                "http://localhost:8080", "https://warwickspeed.run"
            )

        out_file.write(content)

shutil.copytree("resources", os.path.join("build", "dist"))
