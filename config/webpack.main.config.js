module.exports = [
  {
    mode: 'development',
    entry: './electron/main.js',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      }]
    },
    output: {
      path: __dirname + '../appdist',
      filename: 'electron.js'
    }
  }
];