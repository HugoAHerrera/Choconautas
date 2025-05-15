const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario_controller');

router.post('/usuarios', usuarioController.crearUsuario);

router.get('/usuarios/:usuario-id', usuarioController.obtenerNoticiasDeUsuario);

router.put('/usuarios/:usuario-id', usuarioController.actualizarUsuario);

router.delete('/usuarios/:usuario-id', usuarioController.eliminarUsuario);

module.exports = router;
