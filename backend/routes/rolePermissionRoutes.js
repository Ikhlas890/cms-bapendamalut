const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/rolePermissionController');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: RolePermissions
 *   description: Endpoint role permission menu per client/group user
 *
 * /api/role-permissions:
 *   get:
 *     tags: [RolePermissions]
 *     summary: Ambil daftar role permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: client_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID client/group user
 *       - in: query
 *         name: menu_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID menu
 *     responses:
 *       200:
 *         description: Daftar role permission. Jika data belum ada, response berupa array kosong.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RolePermission'
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *   post:
 *     tags: [RolePermissions]
 *     summary: Tambah role permission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermissionInput'
 *     responses:
 *       201:
 *         description: Role permission berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role permission berhasil ditambahkan
 *                 permission:
 *                   $ref: '#/components/schemas/RolePermission'
 *       400:
 *         description: client_id/menu_id tidak valid atau tidak ditemukan
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       409:
 *         description: Permission untuk client_id dan menu_id sudah ada
 *
 * /api/role-permissions/client/{client_id}/menus:
 *   get:
 *     tags: [RolePermissions]
 *     summary: Ambil semua menu beserta permission untuk satu client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID client/group user
 *     responses:
 *       200:
 *         description: Daftar menu beserta permission untuk client. Menu tanpa permission akan memiliki nilai permission 0.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menu_id:
 *                     type: integer
 *                     example: 1
 *                   nama_menu:
 *                     type: string
 *                     example: Dashboard
 *                   menu_slug:
 *                     type: string
 *                     example: dashboard
 *                   url:
 *                     type: string
 *                     example: /dashboard
 *                   icon:
 *                     type: string
 *                     nullable: true
 *                     example: pi pi-home
 *                   parent_id:
 *                     type: integer
 *                     nullable: true
 *                     example: null
 *                   urutan:
 *                     type: integer
 *                     example: 1
 *                   status:
 *                     type: integer
 *                     example: 1
 *                   permission_id:
 *                     type: integer
 *                     nullable: true
 *                     example: 5
 *                   client_id:
 *                     type: integer
 *                     example: 2
 *                   can_view:
 *                     type: integer
 *                     example: 1
 *                   can_create:
 *                     type: integer
 *                     example: 1
 *                   can_update:
 *                     type: integer
 *                     example: 1
 *                   can_delete:
 *                     type: integer
 *                     example: 0
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Client tidak ditemukan
 *
 * /api/role-permissions/{id}:
 *   get:
 *     tags: [RolePermissions]
 *     summary: Ambil detail role permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID role permission
 *     responses:
 *       200:
 *         description: Detail role permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermission'
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Role permission tidak ditemukan
 *   put:
 *     tags: [RolePermissions]
 *     summary: Edit role permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID role permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermissionInput'
 *     responses:
 *       200:
 *         description: Role permission berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role permission berhasil diperbarui
 *                 permission:
 *                   $ref: '#/components/schemas/RolePermission'
 *       400:
 *         description: client_id/menu_id tidak valid atau tidak ditemukan
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Role permission tidak ditemukan
 *       409:
 *         description: Permission untuk client_id dan menu_id sudah ada
 *   delete:
 *     tags: [RolePermissions]
 *     summary: Hapus role permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID role permission
 *     responses:
 *       200:
 *         description: Role permission berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role permission berhasil dihapus
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Role permission tidak ditemukan
 */
router.use(auth);
router.get('/', rolePermissionController.getRolePermissions);
router.get('/client/:client_id/menus', rolePermissionController.getClientMenuPermissions);
router.get('/:id', rolePermissionController.getRolePermissionById);
router.post('/', rolePermissionController.addRolePermission);
router.put('/:id', rolePermissionController.editRolePermission);
router.delete('/:id', rolePermissionController.deleteRolePermission);

module.exports = router;
