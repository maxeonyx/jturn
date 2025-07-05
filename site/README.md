# J-Turn Site

This is the J-Turn project website. Currently, it provides just a brief description of the project vision and links to various demos.

## Development
The site is built using Vue.js.

### Dynamic Demo Links
1. The Vite plugin scans the `demos/[demoname]/` directories during the build.
2. A JSON file (`demo-links.json`) is generated containing demo names and paths.
3. The Vue.js app fetches this JSON file and renders the links dynamically.

## Usage
To run the site locally:
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

## Deployment
The site is deployed to GitHub Pages via [the GitHub Actions workflow](../.github/workflows/static.yml).

---
