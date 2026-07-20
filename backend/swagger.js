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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserCms: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'operator-bapenda',
            },
            client_id: {
              type: 'integer',
              example: 2,
            },
            nama_instansi: {
              type: 'string',
              example: 'Bapenda Maluku Utara',
            },
            slug: {
              type: 'string',
              example: 'bapenda-maluku-utara',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // lokasi file route
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
