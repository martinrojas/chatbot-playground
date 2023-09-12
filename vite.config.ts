import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3000,
		open: true
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
