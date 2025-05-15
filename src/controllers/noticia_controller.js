const noticiaService = require('../services/noticia_service');
const comentarioService = require('../services/comentario_service');

const crearNoticia = async (req, res) => {
  try {
    const noticiaData = req.body;
    const noticia = await noticiaService.crearNoticia(noticiaData);
    res.status(201).json(noticia);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la noticia', error: error.message });
  }
};

const obtenerNoticias = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, categoria, fechaInicio, fechaFin } = req.query;
    const noticias = await noticiaService.obtenerNoticias(pagina, limite, categoria, fechaInicio, fechaFin);
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo las noticias', error: error.message });
  }
};

const obtenerNoticiasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    const noticias = await noticiaService.obtenerNoticiasPorFecha(fecha);

    if (!noticias.length) {
      return res.status(404).json({ message: 'No hay noticias para esa fecha' });
    }

    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo noticias', error: error.message });
  }
};

const obtenerComentariosDeNoticia = async (req, res) => {
  try {
    const { noticiaId } = req.params;

    const noticia = await noticiaService.obtenerNoticiaPorId(noticiaId);
    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    const comentarios = await comentarioService.obtenerComentariosDeNoticia(noticiaId);

    if (!comentarios.length) {
      return res.status(404).json({ message: 'Noticia sin comentarios' });
    }

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo comentarios', error: error.message });
  }
};


const crearComentarioEnNoticia = async (req, res) => {
  try {
    const { noticiaId } = req.params;
    const comentarioData = req.body;
    const comentario = await comentarioService.crearComentarioEnNoticia(noticiaId, comentarioData);

    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error creando comentario', error: error.message });
  }
};

const borrarComentariosDeNoticia = async (req, res) => {
  try {
    const { noticiaId } = req.params;
    const resultado = await comentarioService.borrarComentariosDeNoticia(noticiaId);

    if (!resultado) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    res.status(201).json({ message: 'Comentarios eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando comentarios', error: error.message });
  }
};


module.exports = {
  crearNoticia,
  obtenerNoticias,
  obtenerNoticiasPorFecha,
  obtenerComentariosDeNoticia,
  crearComentarioEnNoticia,
  borrarComentariosDeNoticia
};
