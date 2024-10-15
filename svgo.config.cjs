module.exports = {
	multipass: true,
	js2svg: {
		indent: 0,
		pretty: false,
	},
	plugins: [
		// First, add classes to black and white icons
		{
			name: 'addClassesToSVGElement',
			params: {
				className: 'bw-icon',
			},
			fn: (_ast, params, info) => {
				// Apply only to files with the .bw.svg suffix
				return info.path.endsWith('.bw.svg') ? { ...params } : null;
			},
		},
		// Then apply standard optimizations
		{
			name: 'preset-default',
			params: {
				overrides: {
					removeViewBox: false,
					removeUnknownsAndDefaults: {
						keepRoleAttr: true,
					},
				},
			},
		},
		// Separately configure removeAttrs
		{
			name: 'removeAttrs',
			params: {
				attrs: ['class:!/^bw-icon$/'],
			},
			fn: (ast, params, info) => {
				if (info.path.endsWith('.bw.svg')) {
					params.attrs.push('fill', 'stroke', 'stroke-width', 'stroke-opacity');
				}
				return null; // null means "use the plugin's default behavior"
			},
		},
		// Finally, remove unnecessary spaces and optimize styles
		'removeEmptyAttrs',
		'removeEmptyText',
		'removeEmptyContainers',
		'minifyStyles',
		'convertStyleToAttrs',
	],
};
