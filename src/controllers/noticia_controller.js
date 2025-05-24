const noticiaService = require('../services/noticia_service');
const comentarioService = require('../services/comentario_service');

const crearNoticia = async (req, res) => {
  try {
    const { titulo, contenido, autorId, categoriaId } = req.body;

    if (!titulo || !contenido || !autorId || !categoriaId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const noticiaData = req.body;
    const noticia = await noticiaService.crearNoticia(noticiaData);
    res.status(201).json(noticia);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la noticia', error: error.message });
  }
};

const obtenerNoticias = async (req, res) => {
  try {
    const { pagina = 30, limite = 10, categoria, fechaInicio, fechaFin } = req.query;
    const noticias = await noticiaService.obtenerNoticias(pagina, limite, categoria, fechaInicio, fechaFin);
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo las noticias', error: error.message });
  }
};

const obtenerNoticiasNasa = async (req, res) => {
  try {
    const noticias = await noticiaService.obtenerNoticiasDeAutorNasa();
    res.status(200).json(noticias);
  } catch (error) {
    res.status(503).json({ message: 'Servidor no disponible', error: error.message });
  }
};

const obtenerNoticiasPorFechaGenerico = async (req, res, servicio) => {
  try {
    const { fecha } = req.params;
    const fechaObj = new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    const inicioDia = new Date(fechaObj);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fechaObj);
    finDia.setHours(23, 59, 59, 999);

    const noticias = await servicio(inicioDia, finDia);

    if (!noticias.length) {
      return res.status(404).json({ message: 'No hay noticias para esa fecha' });
    }

    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo noticias', error: error.message });
  }
};

const obtenerNoticiasPorFecha = (req, res) => {
  return obtenerNoticiasPorFechaGenerico(req, res, noticiaService.obtenerNoticiasPorFecha);
};

const obtenerNoticiasNasaPorFecha = (req, res) => {
  return obtenerNoticiasPorFechaGenerico(req, res, noticiaService.obtenerNoticiasNasaPorFecha);
};


const obtenerNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await noticiaService.obtenerNoticiaPorId(id);

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    res.status(200).json(noticia);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo la noticia', error: error.message });
  }
};

const actualizarNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevosDatos = req.body;

    const { titulo, contenido, autorId } = req.body;

    if (!titulo || !contenido || !autorId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const noticiaExistente = await noticiaService.obtenerNoticiaPorId(id);
    if (!noticiaExistente) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    const noticiaActualizada = await noticiaService.actualizarNoticiaPorId(id, nuevosDatos);

    res.status(200).json(noticiaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando noticia', error: error.message });
  }
};

const borrarNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const noticiaExistente = await noticiaService.obtenerNoticiaPorId(id);
    if (!noticiaExistente) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    await noticiaService.borrarNoticiaPorId(id);

    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error borrando noticia', error: error.message });
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
      return res.status(200).json({ message: 'Noticia sin comentarios' });
    }

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo comentarios', error: error.message });
  }
};

const obtenerComentarioPorId = async (req, res) => {
  try {
    const { noticiaId, comentarioId } = req.params;

    const noticia = await noticiaService.obtenerNoticiaPorId(noticiaId);
    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    const comentario = await comentarioService.obtenerComentarioPorId(noticiaId, comentarioId);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo comentario', error: error.message });
  }
};

const crearComentarioEnNoticia = async (req, res) => {
  try {
    const { noticiaId } = req.params;
    const comentarioData = req.body;

    const { ObjectId } = require('mongodb');
    if (!ObjectId.isValid(noticiaId)) {
      return res.status(400).json({ message: 'ID de noticia inválido' });
    }

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

    res.status(204).json({ message: 'Comentarios eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando comentarios', error: error.message });
  }
};

const actualizarComentario = async (req, res) => {
  try {
    const { noticiaId, comentarioId } = req.params;
    const { contenido, autorId } = req.body;

    if (!contenido || autorId == null) {
      return res.status(400).json({ message: 'Los campos contenido y autorId son obligatorios' });
    }

    const noticia = await noticiaService.obtenerNoticiaPorId(noticiaId);
    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    const comentarioActualizado = await comentarioService.actualizarComentario(noticiaId, comentarioId, { contenido, autorId });

    res.status(200).json(comentarioActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando comentario', error: error.message });
  }
};

const borrarComentarioPorId = async (req, res) => {
  try {
    const { noticiaId, comentarioId } = req.params;

    const noticia = await noticiaService.obtenerNoticiaPorId(noticiaId);
    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    const eliminado = await comentarioService.borrarComentarioPorId(noticiaId, comentarioId);
    if (!eliminado) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando comentario', error: error.message });
  }
};

module.exports = {
  crearNoticia,
  obtenerNoticias,
  obtenerNoticiasNasa,
  obtenerNoticiasPorFecha,
  obtenerNoticiasNasaPorFecha,
  obtenerNoticiaPorId,
  actualizarNoticiaPorId,
  borrarNoticiaPorId,
  obtenerComentariosDeNoticia,
  obtenerComentarioPorId,
  crearComentarioEnNoticia,
  borrarComentariosDeNoticia,
  actualizarComentario,
  borrarComentarioPorId
};
