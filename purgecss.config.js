module.exports = {
  content: ['public/*.html', 'public/**/*.html', 'public/*.js', 'public/**/*.js'],
  css: ['public/*.css'],
  output: 'public',
  dynamicAttributes: ["data-bs-theme", "aria-expanded"],
  safelist: [/phase-/]
}