const noticiaService = require('../services/noticia_service');
const comentarioService = require('../services/comentario_service');
const { fetchNoticias, obtenerNoticiasEnBloquesNASA } = require('../request_api_nasa/nasaAPOD');

const crearNoticia = async (req, res) => {
  try {
    const noticiaData = req.body;
    const noticia = await noticiaService.crearNoticia(noticiaData);
    res.status(201).json(noticia);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la noticia', error: error.message });
  }
};

const crearNoticiaNasa = async (req, res) => {
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


const obtenerNoticiasNasa = async (req, res) => {
  try {
    const { start = '2025-05-01', end = '2025-05-03' } = req.query;
    const noticias = await obtenerNoticiasEnBloquesNASA(start, end);
    res.status(200).json(noticias);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      res.status(403).json({ error: 'Clave API inválida o límite superado.' });
    } else {
      res.status(500).json({ error: 'Error al obtener las noticias APOD.', detalle: error.message });
    }
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


const obtenerNoticiasNasaPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params; // <-- CAMBIO AQUÍ

    if (!fecha) {
      return res.status(400).json({ error: 'Debes proporcionar una fecha en el parámetro "fecha".' });
    }

    const noticias = await fetchNoticias(fecha, fecha); // misma fecha como inicio y fin
    res.status(200).json(noticias[0]); // solo una noticia
  } catch (error) {
    console.error("Error en obtenerNoticiasNasaPorFecha:", error.message);
    res.status(500).json({ error: 'Error al obtener la noticia APOD.', detalle: error.message });
  }
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
  crearNoticiaNasa,
  obtenerNoticias,
  obtenerNoticiasNasa,
  obtenerNoticiasPorFecha,
  obtenerNoticiasNasaPorFecha,
  obtenerNoticiaPorId,
  obtenerComentariosDeNoticia,
  obtenerComentarioPorId,
  crearComentarioEnNoticia,
  borrarComentariosDeNoticia
};
