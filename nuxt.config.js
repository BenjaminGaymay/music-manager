// const colors = require('vuetify/es5/util/colors').default

module.exports = {
	telemetry: false,

	server: {
		port: 8080, // default: 3000
		host: '0.0.0.0', // default: localhost,
		timing: false
	},

	router: {
		base: '/musiques',
		trailingSlash: false
	},

	ssr: false,

	/*
	 ** Headers of the page
	 */
	head: {
		titleTemplate: '%s',
		title: process.env.npm_package_name || '',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [{ hid: 'icon', rel: 'icon', type: 'image/x-icon', href: '/musiques/img/default.png' }]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#fff' },
	/*
	 ** Global CSS
	 */
	css: ['@fortawesome/fontawesome-svg-core/styles.css'],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: ['~/plugins/fontawesome.js'],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: ['@nuxtjs/vuetify'],
	/*
	 ** Nuxt.js modules
	 */
	modules: ['@nuxtjs/axios'],

	axios: {
		baseURL: 'https://benjamin-gaymay.eu/musiques'
		// baseURL: 'http://localhost:8080'
	},
	/*
	 ** vuetify module configuration
	 ** https://github.com/nuxt-community/vuetify-module
	 */
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: '#1E1E1E',
					accent: '#FF00FF',
					secondary: '#179EA8',
					success: '#42F849',
					info: '#2196F3',
					warning: '#FB8C00',
					error: '#FF5252'
				},
				light: {
					primary: '#1976D2',
					accent: '#e91e63',
					secondary: '#30b1dc',
					success: '#4CAF50',
					info: '#2196F3',
					warning: '#FB8C00',
					error: '#FF5252'
				}
			}
		}
	},
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {}
	}
};
