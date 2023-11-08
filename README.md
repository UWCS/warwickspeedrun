# warwickspeedrun

This is the GitHub repository of the website for Warwick's Awesome Speedruns and Demos (WASD), a student-run speedrunning marathon in the UK. It has recently been remade with Zola & Bootstrap to align with [stardust](https://github.com/UWCS/stardust) for easier maintenance.

## Installation

1. Install Zola (either [base](https://www.getzola.org/documentation/getting-started/installation/) or [my fork](https://github.com/ericthelemur/zola)):
2. Clone this repo (with submodules) `git clone --recurse-submodules`
4. Run Zola with `zola serve` in project root
    - This rebuilds the website on changes, and serves it at http://127.0.0.1:1111
5. HTML Templates are in `/templates`, and content is mostly in `/content`, though some of the frontpage is in `/front` and the runners guide in `/guide`.

- The site will automatically redeploy on pushes to master, and the shortcut links can be changed in `redirects.conf`.
- If something breaks in prod but not locally, it could be `purgecss`, which is run automatically to reduce bloat from Bootstrap. Test it locally and add exceptions to `safeList` in `purgecss.config.js`
- Most of the per-year variables are in `config.toml` under `[extra]`
- The favicon set is generated from [realfavicongenerator.net](https://realfavicongenerator.net/), with the boilerplate in `templates/parts/head`.