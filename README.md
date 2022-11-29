# warwickspeedrun

This is the GitHub repository of the website for Warwick's Awesome Speedruns and Demos (WASD), a student-run speedrunning marathon in the UK.

The project uses a basic static site generator to combine markdown into a single page website. The code for this generator is in `build.py`, run with `--dev` to link locally. Running this project requires `python >= 3.9`.

Building CSS (from `src/stylesheet`) requires Node. Run `npm install` then `npm run css-watch` in `src/stylesheet`.

Use `python -m http.server 8080 --directory build` to host a dev server (Note, run outside of build, so build can be recreated each time).

### License

This project is licensed using an MIT license.

```
MIT License

Copyright (c) 2020 David Richardson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
