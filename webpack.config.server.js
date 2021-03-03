//* Require de modulos
const path = require('path')
const nodeExternals = require('webpack-node-externals')
//* Retorna el directorio actual
const CURRENT_WORKING_DIR = process.cwd()

const config = {
  name: "server",
  entry: [ path.join(CURRENT_WORKING_DIR , './server/server.js') ],
  target: "node",
  output: {
    path: path.join(CURRENT_WORKING_DIR , '/dist/'),
    filename: "server.generated.js",
    publicPath: '/dist/',
    libraryTarget: "commonjs2"
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },
      {//* Se encarga de cargar, hacer el build y reflejar las imagenes al directorio dist con el código generado
        test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
        use: 'file-loader'
      }
    ]
  }
}

module.exports = config