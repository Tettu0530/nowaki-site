// SvelteKit 3 takes its config here. Static output, like Astro's default:
// `/` is prerendered to build/index.html.
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [sveltekit({ adapter: adapter() })] });
