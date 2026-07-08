const bcrypt = require('bcrypt');
const db = require('../config/db');

(async () => {
  const hashedPassword = await bcrypt.hash('adminmalut123', 10);
  const clientId = 2; // id dari tabel clients, bukan nama instansi

  await db.query(
    'INSERT INTO admins (username, password, client_id) VALUES (?, ?, ?)',
    ['admin malut', hashedPassword, clientId]
  );

  console.log('✅ Admin untuk Bapenda Maluku berhasil ditambahkan!');
  process.exit();
})();