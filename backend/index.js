const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const postRoutes = require('./routes/postRoutes');
const strukturRoutes = require('./routes/struktur-organisasi');
const pengaduanRoutes = require('./routes/pengaduanRoutes');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const clientRoutes = require('./routes/clientRoutes');
const { swaggerUi, specs } = require('./swagger');
const app = express();

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://cms.intermatika.id',
    'https://bapendamaluku.id'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/posts', postRoutes);
app.use('/api/struktur-organisasi', strukturRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/clients', clientRoutes);

// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
