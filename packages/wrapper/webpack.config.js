const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin')

class WebpackTransformerPlugin {
  apply(compiler) {
    const pluginName = WebpackTransformerPlugin.name
    const { webpack } = compiler
    const { Compilation } = webpack
    const { RawSource } = webpack.sources

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          const editor = assets['editor.html']
          compilation.emitAsset(
            'editor.json',
            new RawSource(JSON.stringify([
              JSON.stringify(editor.source())
            ]))
          )
          compilation.deleteAsset('editor.html')
        }
      )
    })
  }
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../component/generated'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      filename: 'editor.html'
    }),
    new HtmlInlineScriptPlugin(),
    new WebpackTransformerPlugin()
  ],
  module: {
    rules: [{
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }]
  }
}
