const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIs Call Center System',
      version: '1.0.0',
      description: 'Documentacion de APIs del Call Center System'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: [`${__dirname}/../routes/*.js`]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
