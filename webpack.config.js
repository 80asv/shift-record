const Dotenv = require('dotenv-webpack');

module.exports = {
  // ...
  plugins: [
    new Dotenv({
      path: '.env.production', // carga este archivo en entornos de producción
      safe: true // carga el archivo .env.example como valores por defecto
    })
  ]
};
