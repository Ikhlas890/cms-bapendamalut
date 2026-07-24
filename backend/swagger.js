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
        Menu: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nama_menu: {
              type: 'string',
              example: 'Dashboard',
            },
            slug: {
              type: 'string',
              example: 'dashboard',
            },
            url: {
              type: 'string',
              example: '/dashboard',
            },
            icon: {
              type: 'string',
              nullable: true,
              example: 'pi pi-home',
            },
            parent_id: {
              type: 'integer',
              nullable: true,
              example: null,
            },
            urutan: {
              type: 'integer',
              example: 1,
            },
            status: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            created_at: {
              type: 'string',
              example: '2026-07-22 10:30:00',
            },
            updated_at: {
              type: 'string',
              example: '2026-07-22 10:30:00',
            },
          },
        },
        MenuInput: {
          type: 'object',
          required: ['nama_menu', 'url'],
          properties: {
            nama_menu: {
              type: 'string',
              example: 'Hak Akses',
            },
            slug: {
              type: 'string',
              readOnly: true,
              example: 'hak-akses',
            },
            url: {
              type: 'string',
              example: '/dashboard',
            },
            icon: {
              type: 'string',
              nullable: true,
              example: 'pi pi-home',
            },
            parent_id: {
              type: 'integer',
              nullable: true,
              example: null,
            },
            urutan: {
              type: 'integer',
              example: 1,
            },
            status: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
          },
        },
        Panduan: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            judul: {
              type: 'string',
              example: 'Cara Membayar Pajak Daerah',
            },
            tipe: {
              type: 'string',
              enum: ['video', 'teks', 'link', 'file'],
              example: 'teks',
            },
            konten: {
              type: 'string',
              nullable: true,
              example: 'Isi panduan pembayaran pajak daerah.',
            },
            status: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            created_by: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            updated_by: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            created_at: {
              type: 'string',
              example: '2026-07-23 10:30:00',
            },
            updated_at: {
              type: 'string',
              example: '2026-07-23 10:30:00',
            },
          },
        },
        PanduanInput: {
          type: 'object',
          required: ['judul', 'tipe'],
          properties: {
            judul: {
              type: 'string',
              example: 'Cara Membayar Pajak Daerah',
            },
            tipe: {
              type: 'string',
              enum: ['video', 'teks', 'link', 'file'],
              example: 'teks',
            },
            konten: {
              type: 'string',
              nullable: true,
              example: 'Isi panduan pembayaran pajak daerah.',
            },
            status: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
          },
        },
        RolePermission: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            client_id: {
              type: 'integer',
              example: 2,
            },
            nama_instansi: {
              type: 'string',
              example: 'Bapenda Maluku Utara',
            },
            client_slug: {
              type: 'string',
              example: 'bapenda-maluku-utara',
            },
            menu_id: {
              type: 'integer',
              example: 1,
            },
            nama_menu: {
              type: 'string',
              example: 'Dashboard',
            },
            menu_slug: {
              type: 'string',
              example: 'dashboard',
            },
            url: {
              type: 'string',
              example: '/dashboard',
            },
            icon: {
              type: 'string',
              nullable: true,
              example: 'pi pi-home',
            },
            parent_id: {
              type: 'integer',
              nullable: true,
              example: null,
            },
            urutan: {
              type: 'integer',
              example: 1,
            },
            can_view: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            can_create: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            can_update: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            can_delete: {
              type: 'integer',
              enum: [0, 1],
              example: 0,
            },
            created_at: {
              type: 'string',
              example: '2026-07-22 10:30:00',
            },
            updated_at: {
              type: 'string',
              example: '2026-07-22 10:30:00',
            },
          },
        },
        RolePermissionInput: {
          type: 'object',
          required: ['client_id', 'menu_id'],
          properties: {
            client_id: {
              type: 'integer',
              example: 2,
            },
            menu_id: {
              type: 'integer',
              example: 1,
            },
            can_view: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            can_create: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            can_update: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
            },
            can_delete: {
              type: 'integer',
              enum: [0, 1],
              example: 0,
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
