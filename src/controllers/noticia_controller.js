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

const obtenerNoticias = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, categoria, fechaInicio, fechaFin } = req.query;
    const noticias = await noticiaService.obtenerNoticias(pagina, limite, categoria, fechaInicio, fechaFin);
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo las noticias', error: error.message });
  }
};
async function obtenerNoticiasNasa(req, res) {
  const { start = '2025-04-01', end = '2025-05-06' } = req.query;
  const noticiasPorPagina = 3;

  try {
    const todasLasNoticias = await obtenerNoticiasEnBloquesNASA(start, end);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    let pagina = 0;

    const enviarNoticias = () => {
      const startIndex = pagina * noticiasPorPagina;
      const noticiasPaginadas = todasLasNoticias.slice(startIndex, startIndex + noticiasPorPagina);

      if (noticiasPaginadas.length === 0) {
        res.write(`event: end\ndata: No hay más noticias.\n\n`);
        return res.end();
      }

      res.write(`data: ${JSON.stringify(noticiasPaginadas)}\n\n`);
      pagina++;

      setTimeout(enviarNoticias, 120000); // 2 minutos
    };

    enviarNoticias();

  } catch (error) {
    // Detectar si el error proviene de Axios o similar
    try {
      const min = 20;
      const max = 30;

      // Por autor id ya que del 20 al 30 son de la NASA
      const noticias = await noticiaService.obtenerNoticiasPorRangoAutorId(min, max);

      if (!noticias.length) {
        return res.status(404).json({ message: 'No hay noticias con autorId entre 20 y 30' });
      }

      res.status(200).json(noticias);
    } catch (error) {
        res.status(503).json({ message: 'Servicio no disponible', error: error.message });
  }
    res.end();
  }
}

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
   const { fecha } = req.params;

   if (!fecha) {
     return res.status(400).json({ error: 'Debes proporcionar una fecha en el parámetro "fecha".' });
    }

    const noticias = await fetchNoticias(fecha, fecha); // misma fecha como inicio y fin
    res.status(200).json(noticias); // solo una noticia
  } catch (error) {
    const noticiasSinApi = await fetchNoticiasNASASinAPI(fecha,fecha);
    res.status(200).json(noticiasSinApi);
    res.status(400).json({ message: 'Error, fecha invalida', error: error.message });
    res.status(404).json({ message: 'No hay noticias para esa fecha', error: error.message });
    res.status(503).json({ message: 'Servicio no disponible', error: error.message });

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

const actualizarNoticiaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevosDatos = req.body;

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
