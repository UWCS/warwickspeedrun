# warwickspeedrun

This is the GitHub repository of the website for Warwick's Awesome Speedruns and Demos (WASD), a student-run speedrunning marathon in the UK.

The project uses a basic static site generator to combine markdown into a single page website. 

The code for this generator is in `build.py`. 

## Installation

**Without Docker**

1. Install pipenv with `pip install pipenv` 
2. Install dependencies with `pipenv install` in a new venv
3. Build the site with `pipenv run python build.py`
3. Launch Python's dev server with ``python -m http.server 8080 --directory build`
    - Note: Run this in the project root, so `build` can be deleted and recreated each time.

**With Docker**
Build with Docker Compose: `docker compose up --build`. This also includes a prod web server and the relevant redirects.

### Stylesheet

Building CSS (from `src/stylesheet`) requires Node. Run `npm install` then `npm run css-watch` in `src/stylesheet`. This must be done separately Docker, as it is not built in the script. 