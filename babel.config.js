const plugins = [];
if(['production', 'prod'].includes(process.env.NODE_ENV)) {
  plugins.push("transform-remove-console")
}
// plugins.push(["import", {
// 			"libraryName": "ant-design-vue",
// 			"libraryDirectory": "es",
// 			"style": true
// 			
// 		}] // `style: true` 会加载 less 文件
// 	)
module.exports = {
	presets: [
		["@vue/app", {
			"useBuiltIns": "entry"
		}]
	],
	// presets: [
	// 	'@vue/app',
	// 	 [
	// 	  '@babel/preset-env',
	// 	  {
	// 	    'useBuiltIns': 'entry'
	// 	  }
	// 	]
	// ],
	
	"plugins":plugins

};
 