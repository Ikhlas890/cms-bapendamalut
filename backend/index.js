const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const postRoutes = require('./routes/postRoutes');
const strukturRoutes = require('./routes/struktur-organisasi');
const pengaduanRoutes = require('./routes/pengaduanRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const clientRoutes = require('./routes/clientRoutes');
const menuRoutes = require('./routes/menuRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const panduanRoutes = require('./routes/panduanRoutes');
const { getUploadFallbackUrl } = require('./utils/uploadUrl');
const { specs } = require('./swagger');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const allowedOrigins = [
  'http://localhost:4200',
  'http://192.168.100.6:3000',
  'https://cms-malut.intermatika.id',
  'https://cms.intermatika.id',
  'https://bapendamaluku.id'
];

app.set('trust proxy', true);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api-docs/swagger.json', (req, res) => {
  res.json(specs);
});

app.get(['/api-docs', '/api-docs/'], (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>API Malut CMS Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <link rel="icon" href="data:,">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>`);
});
app.use('/api/posts', postRoutes);
app.use('/api/struktur-organisasi', strukturRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/role_permissions', rolePermissionRoutes);
app.use('/api/panduan', panduanRoutes);

// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', (req, res, next) => {
  const fallbackUrl = getUploadFallbackUrl(req, `/uploads${req.path}`);
  if (!fallbackUrl) return next();

  return res.redirect(302, fallbackUrl);
});

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
