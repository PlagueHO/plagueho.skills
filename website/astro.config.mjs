import { defineConfig } from 'astro/config';

// Set `base` to match your GitHub Pages deployment path.
// For a custom domain serving at root, use '/'.
// For a project site at github.io/plagueho.skills/, use '/plagueho.skills/'.
export default defineConfig({
  output: 'static',
  site: 'https://danielscottraynsford.com',
  base: '/plagueho.skills/',
  build: {
    format: 'directory',
  },
});
