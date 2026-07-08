const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Malut CMS',
      version: '1.0.0',
      description: 'Dokumentasi endpoint authentication (API CMS Malut)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // lokasi file route
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
