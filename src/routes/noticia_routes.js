const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticia_controller');

router.post('/noticias', noticiaController.crearNoticia);

router.get('/noticias', noticiaController.obtenerNoticias);

router.get('/noticias/fecha/:fecha', noticiaController.obtenerNoticiasPorFecha);

router.get('/noticias/:noticiaId/comentarios', noticiaController.obtenerComentariosDeNoticia);

router.post('/noticias/:noticiaId/comentarios', noticiaController.crearComentarioEnNoticia);

router.delete('/noticias/:noticiaId/comentarios', noticiaController.borrarComentariosDeNoticia);

module.exports = router;
