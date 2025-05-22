const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias_controller');

router.post('/categorias', categoriasController.crearCategoria);

router.get('/categorias', categoriasController.obtenerTodasCategorias);

router.get('/categorias/:categoriaId', categoriasController.obtenerCategoriaConId);

module.exports = router;