/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
	theme: {
		extend: {},
	},
	plugins: [
		function ({addUtilities}) {
			const newUtilities = {
				'.image-rendering-auto': {
					'image-rendering': 'auto',
				},
				'.image-rendering-crisp': {
					'image-rendering': 'crisp-edges',
				},
				'.image-rendering-pixel': {
					'image-rendering': 'pixelated',
				},
			};
			addUtilities(newUtilities, ['responsive', 'hover']);
		},
	],
};
