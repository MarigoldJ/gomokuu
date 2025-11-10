import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.GITHUB_ACTIONS
        ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''}`
        : ''
    },
    prerender: {
      default: true
    }
  },
  preprocess: [vitePreprocess({
    postcss: true
  })]
};

export default config;
