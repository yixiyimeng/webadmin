const createThemeColorReplacerPlugin = require('./config/plugin.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
let pageMethod = require('./config/getPages.js');
pages = pageMethod.pages();
const path = require('path')
function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	lintOnSave: false, //禁用eslint
	productionSourceMap: false,
	// 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
	parallel: require('os').cpus().length > 1,
	pages,
	// publicPath: process.env.NODE_ENV === 'production' ?
	// 	'/teacherAdmin/' :
	// 	'/',
	devServer: {
		index: 'login.html', //默认启动serve 打开index页面
		open: process.platform === 'darwin',
		host: '',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: null, // 设置代理
		before: app => {}
	},
	configureWebpack: (config) => {
		// if (process.env.NODE_ENV === "production") {
		// 	config.output = {
		// 		path: path.join(__dirname, "./dist"),
		// 		filename: "js/[name].[contenthash:8].js"
		// 	};
		// }
		config.externals = {
			'jquery': 'jquery'
		}
		config.plugins.push(createThemeColorReplacerPlugin())
	},
	chainWebpack: (config) => {
		/* 图片压缩 */
		config.module
			.rule('images')
			.use('url-loader')
			.loader('url-loader')
			.tap(options => {
				// 修改它的选项...
				options.limit = 100
				return options
			})
		config.optimization.splitChunks({
			cacheGroups: {

				vendors: {
					name: 'chunk-vendors',
					minChunks: 2,
					// test: /[\\/]node_modules[\\/]/,
					test: /[\\/]node_modules[\\/](_vue@2.6.10@vue)[\\/]/,
					priority: -10,
					chunks: 'all'
				},
				common: {
					name: 'chunk-common',
					minChunks: 2,
					priority: -20,
					chunks: 'initial',
					reuseExistingChunk: true
				},

			},

		});
		Object.keys(pages).forEach(entryName => {
			config.plugins.delete(`prefetch-${entryName}`);
		});
		if (process.env.NODE_ENV === "production") {
			config.plugin("extract-css").tap(() => [{
				path: path.join(__dirname, "./dist"),
				filename: "css/[name].[contenthash:8].css"
			}]);
		}
		config.resolve.alias
			.set('@$', resolve('src'))
			.set('@api', resolve('src/api'))
			.set('@assets', resolve('src/assets'))
			.set('@comp', resolve('src/components'))
			.set('@views', resolve('src/views'))
			.set('@layout', resolve('src/layout'))
			.set('@static', resolve('src/static'))
			.set('@ant-design/icons/lib/dist$', resolve('src/icons.js'))
			.set('@pages', resolve('src/pages'))
		// 压缩图片
		config.module
			.rule('images')
			.use('image-webpack-loader')
			.loader('image-webpack-loader')
			.options({
				bypassOnDebug: true
			})
			.end()
		if (process.env.IS_ANALYZ) {
			config.plugin('webpack-report').use(BundleAnalyzerPlugin, [{
				analyzerMode: 'static'
			}])
		}
	},

	css: {
		loaderOptions: {
			less: {
				modifyVars: {
					/* less 变量覆盖，用于自定义 ant design 主题 */


					'primary-color': '#125fc9',
					'border-radius-base': '2px'
					/*'link-color': '#F5222D',
				  'border-radius-base': '4px',
				  */
				},
				javascriptEnabled: true,
			}
		}
	},
	/* vue-charts 配置 */
	transpileDependencies: [
		'vue-echarts',
		'resize-detector'
	]
}
