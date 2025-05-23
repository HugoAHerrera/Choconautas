const noticiaService = require('../services/noticia_service');
const comentarioService = require('../services/comentario_service');
const nasaService = require('../request_api_nasa/nasaAPOD');
const path = require('path');
const fs = require('fs');

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


const RETARDO_MS = 1000;

function restarDias(fechaISO, dias) {
  const fecha = new Date(fechaISO);
  fecha.setDate(fecha.getDate() - dias);
  return fecha.toISOString().slice(0, 10);
}

function fechasEnRango(inicio, fin) {
  const fechas = [];
  let fechaActual = new Date(inicio);
  const fechaFin = new Date(fin);
  while (fechaActual <= fechaFin) {
    fechas.push(fechaActual.toISOString().slice(0, 10));
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  return fechas;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function procesoDescargaNoticias(fechaFinal = "2025-05-20") {
  const noticiasPath = path.resolve(__dirname, '../../datasets/noticias.json');
  let fechasExistentes = new Set();

  // Cargar fechas ya existentes
  if (fs.existsSync(noticiasPath)) {
    const contenido = fs.readFileSync(noticiasPath, 'utf-8');
    const noticias = JSON.parse(contenido);
    noticias
      .filter(n => n.autorId === '683050b61388ec33708f9b5e')
      .forEach(n => fechasExistentes.add(n.fecha.slice(0, 10))); // YYYY-MM-DD
  }

  let end = new Date(fechaFinal);

  while (end.getFullYear() >= 1995) {
    const start = new Date(end);
    start.setDate(start.getDate() - 19); // bloque de 20 días

    const fechasBloque = fechasEnRango(formatDate(start), formatDate(end));
    const bloqueYaExiste = fechasBloque.every(f => fechasExistentes.has(f));

    if (bloqueYaExiste) {
      console.log(`⏩ Noticias de ${formatDate(start)} a ${formatDate(end)} ya existen. Saltando...`);
    } else {
      console.log(`⬇️ Descargando noticias de ${formatDate(start)} a ${formatDate(end)}`);
      try {
        await nasaService.obtenerNoticiasEnBloquesNASA(formatDate(start), formatDate(end));
      } catch (error) {
        console.error("❌ Error al descargar noticias:", error.message);
      }
      await new Promise(resolve => setTimeout(resolve, RETARDO_MS));
    }

    end.setDate(end.getDate() - 20);
  }
}

const obtenerNoticiasNasa = async (req, res) => {
  const noticiasPath = path.resolve(__dirname, '../../datasets/noticias.json');
  let noticiasUsuario = [];

  try {
    // 1. Cargar noticias almacenadas del usuario NASA
    if (fs.existsSync(noticiasPath)) {
      const contenido = fs.readFileSync(noticiasPath, 'utf-8');
      const todasLasNoticias = JSON.parse(contenido);
      noticiasUsuario = todasLasNoticias.filter(n => n.autorId === '683050b61388ec33708f9b5e');
    }

    // 2. Lanzar descarga en segundo plano
    procesoDescargaNoticias("2025-05-20")
      .then(() => console.log("✅ Proceso de descarga finalizado"))
      .catch(err => console.error("❌ Error en descarga:", err.message));

    // 3. Responder inmediatamente con las noticias almacenadas
    return res.status(200).json({
      message: 'Mostrando noticias almacenadas. La descarga en segundo plano ha comenzado.',
      noticias: noticiasUsuario,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error mostrando noticias almacenadas.',
      error: error.message,
    });
  }
};

function generarObjectIdSimulado() {
  return Math.random().toString(16).substr(2, 24); // Simulación
}

function getRandomCategoriaId() {
  const categorias = [
    '6830eccca9051e34bc5816e7',
    '6830eccca9051e34bc5816e8',
    '6830eccca9051e34bc5816e9'
  ];
  return categorias[Math.floor(Math.random() * categorias.length)];
}

function generarFechaISOCompleta(fechaStr) {
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return new Date().toISOString();
  return fecha.toISOString();
}



const obtenerNoticiasPorFecha = async (req, res) => {
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

    const noticias = await noticiaService.obtenerNoticiasPorFecha(inicioDia, finDia);

    if (!noticias.length) {
      return res.status(404).json({ message: 'No hay noticias para esa fecha' });
    }

    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo noticias', error: error.message });
  }
};

const obtenerNoticiasNasaPorFecha = async (req, res) => {
  const fechaParam = req.params.fecha;

  if (!fechaParam) {
    return res.status(400).json({ error: 'Debes proporcionar una fecha en el parámetro "fecha".' });
  }

  try {
    const noticias = await noticiaService.obtenerNoticiasNasaPorFecha(fechaParam);

    if (!Array.isArray(noticias) || noticias.length === 0) {
      throw new Error('No se obtuvieron noticias de la API');
    }

    return res.status(200).json(noticias);

  } catch (error) {
    try {
      const noticiasPath = path.resolve(__dirname, '../../datasets/noticias.json');
      if (!fs.existsSync(noticiasPath)) {
        return res.status(404).json({ message: 'No hay noticias disponibles localmente.' });
      }

      const contenido = fs.readFileSync(noticiasPath, 'utf-8');
      const todasLasNoticias = JSON.parse(contenido);

      const noticiasLocales = todasLasNoticias.filter(n =>
        typeof n.fecha === 'string' &&
        n.fecha.substring(0, 10) === fechaParam &&
        n.autorId === '683050b61388ec33708f9b5e'
      );

      if (noticiasLocales.length === 0) {
        return res.status(404).json({ message: 'No hay noticias para esa fecha ni localmente.' });
      }

      return res.status(200).json(noticiasLocales);

    } catch (fsError) {
      console.error('Error leyendo noticias locales:', fsError);
      return res.status(500).json({ message: 'Error leyendo noticias locales.', error: fsError.message });
    }
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
  procesoDescargaNoticias,
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
