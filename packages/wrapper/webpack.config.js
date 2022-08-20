const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin')

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
    new HtmlInlineScriptPlugin()
  ],
  module: {
    rules: [{
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }]
  }
}
