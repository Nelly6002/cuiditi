import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Runes mode for our code; libraries decide for themselves.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Every page is prerendered (see src/routes/+layout.js), so Vercel serves static files.
			adapter: adapter()
		})
	],
	server: { port: 5190, strictPort: true },
	preview: { port: 5190, strictPort: true }
});
