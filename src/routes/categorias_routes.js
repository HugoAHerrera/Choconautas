const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categories_controller');

router.post('/categorias', categoriasController.crearCategoria);

router.get('/categorias/:categoria-id', categoriasController.obtenerTodasCategorias);

router.get('/categorias/:categoria-id', categoriasController.obtenerCategoriaConId);

module.exports = router;