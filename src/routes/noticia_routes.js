const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticia_controller');

router.post('/noticias', noticiaController.crearNoticia);

router.get('/noticias', noticiaController.obtenerNoticias);

module.exports = router;
