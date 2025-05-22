const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario_controller');

router.post('/usuarios', usuarioController.crearUsuario);

router.get('/usuarios/:usuarioId', usuarioController.obtenerNoticiasDeUsuario);
router.put('/usuarios/:usuarioId', usuarioController.actualizarUsuario);
router.delete('/usuarios/:usuarioId', usuarioController.eliminarUsuario);

module.exports = router;