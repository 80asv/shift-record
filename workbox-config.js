module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{json,svg,html,png,txt,js,css,md,jsx,scss}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};