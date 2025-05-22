const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticia_controller');

router.post('/noticias', noticiaController.crearNoticia);

router.get('/noticias', noticiaController.obtenerNoticias);

router.get('/noticias/nasa', noticiaController.obtenerNoticiasNasa);

router.get('/noticias/fecha/:fecha', noticiaController.obtenerNoticiasPorFecha);

router.get('/noticias/nasa/fecha/:fecha', noticiaController.obtenerNoticiasNasaPorFecha);

router.get('/noticias/id/:id', noticiaController.obtenerNoticiaPorId);

router.put('/noticias/id/:id', noticiaController.actualizarNoticiaPorId);

router.delete('/noticias/id/:id', noticiaController.borrarNoticiaPorId);

router.get('/noticias/:noticiaId/comentarios', noticiaController.obtenerComentariosDeNoticia);

router.post('/noticias/:noticiaId/comentarios', noticiaController.crearComentarioEnNoticia);

router.delete('/noticias/:noticiaId/comentarios', noticiaController.borrarComentariosDeNoticia);

router.get('/noticias/:noticiaId/comentarios/:comentarioId', noticiaController.obtenerComentarioPorId);

router.put('/noticias/:noticiaId/comentarios/:comentarioId', noticiaController.actualizarComentario);

router.delete('/noticias/:noticiaId/comentarios/:comentarioId', noticiaController.borrarComentarioPorId);



module.exports = router;
