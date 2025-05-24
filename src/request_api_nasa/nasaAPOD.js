const fs = require('fs');
const path = require('path');
const axios = require('axios');
const noticiaService = require('../services/noticia_service');

// Configuración
const BLOQUE_DIAS = 2;
const DELAY_MS = 1000;
const API_KEY = 'vVpmRmdUTmdxpOHlpeoJrUeG1A8CjlDN3C4hSbgX'; // Reemplaza con tu clave real

let procesoActivo = false;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function iniciarProcesoRetroactivo(fechaFinal = "2025-05-20", diasPorBloque = 20, intervaloMinutos = 3) {
  if (procesoActivo) return;

  procesoActivo = true;
  let end = new Date(fechaFinal);

  const intervalo = setInterval(async () => {
    const start = new Date(end);
    start.setDate(start.getDate() - (diasPorBloque - 1));

    try {
      const noticias = await obtenerNoticiasEnBloquesNASA(formatDate(start), formatDate(end));
      guardarNoticias(noticias);
    } catch (e) {
      // manejar errores
    }

    end.setDate(end.getDate() - diasPorBloque);

    if (end.getFullYear() < 1995) { // límite APOD
      clearInterval(intervalo);
      procesoActivo = false;
    }
  }, intervaloMinutos * 60 * 1000);
}


function getRandomCategoriaId() {
  return Math.floor(Math.random() * 7) + 1; // genera un número entre 1 y 7
}


function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generarObjectIdSimulado() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
  return timestamp + random;
}

function getRandomCategoriaId() {
  return generarObjectIdSimulado(); // ahora es un string tipo ObjectId
}

function generarFechaISOCompleta(fecha) {
  return new Date(fecha).toISOString(); // incluye hora
}


async function fetchNoticias(start, end) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;
  const response = await axios.get(url);

  const noticias = response.data.map(item => ({
    titulo: item.title,
    contenido: item.explanation,
    fecha: item.date,
  }));

  return noticias;
}
async function obtenerNoticiasEnBloquesNASA(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  const nuevasNoticias = [];

  while (start <= end) {
    let bloqueEnd = addDays(start, BLOQUE_DIAS - 1);
    if (bloqueEnd > end) bloqueEnd = end;

    try {
      const noticias = await fetchNoticias(formatDate(start), formatDate(bloqueEnd));

      noticias.forEach(noticia => {
        nuevasNoticias.push({
          _id: generarObjectIdSimulado(),
          titulo: noticia.titulo || 'Sin título',
          contenido: noticia.contenido || 'Sin explicación',
          fecha: generarFechaISOCompleta(noticia.fecha || start),
          autorId: "683050b61388ec33708f9b5e",
          categoriaId: getRandomCategoriaId()
        });
      });

    } catch (error) {
      console.error(`Error al obtener noticias del ${formatDate(start)} al ${formatDate(bloqueEnd)}:`, error.message);
      return []; // Si falla, omitir bloque
    }

    start = addDays(bloqueEnd, 1);
    await delay(DELAY_MS);
  }

  // Guardar noticias en la base de datos
  for (const noticia of nuevasNoticias) {
    await noticiaService.añadirNoticiaNasa(noticia);
  }

  return nuevasNoticias;
}

const obtenerNoticiasNasaPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;

    if (!fecha) {
      return res.status(400).json({ error: 'Debes proporcionar una fecha en el parámetro "fecha".' });
    }

    // Intentamos obtener noticias desde el servicio externo (API)
    const noticias = await noticiaService.obtenerNoticiasNasaPorFecha(fecha);

    if (!Array.isArray(noticias) || noticias.length === 0) {
      // No hay noticias de la API, intentamos buscar locales
      const noticiasPath = path.resolve(__dirname, '../../datasets/noticias.json');

      if (!fs.existsSync(noticiasPath)) {
        return res.status(404).json({ message: 'No hay noticias para esa fecha ni archivo local disponible.' });
      }

      const contenido = fs.readFileSync(noticiasPath, 'utf-8');
      const todasLasNoticias = JSON.parse(contenido);

      // Filtramos por fecha exacta (ISO string) y autorId
      const noticiasLocales = todasLasNoticias.filter(n => 
        n.fecha.startsWith(fecha) && n.autorId === '683050b61388ec33708f9b5e'
      );

      if (noticiasLocales.length === 0) {
        return res.status(404).json({ message: 'No hay noticias para esa fecha ni localmente.' });
      }

      return res.status(200).json(noticiasLocales);
    }

    return res.status(200).json(noticias);
  } catch (error) {
    console.error('Error en obtenerNoticiasNasaPorFecha:', error);
    return res.status(503).json({ message: 'Servicio no disponible', error: error.message });
  }
};

async function obtenerNoticiasUnaVez() {
  const fechaInicio = "2025-05-01";
  const fechaFin = "2025-05-11";
  const noticias = await obtenerNoticiasEnBloquesNASA(fechaInicio, fechaFin);
  return noticias;
}

module.exports = {
  obtenerNoticiasNasaPorFecha,
  iniciarProcesoRetroactivo,
  obtenerNoticiasEnBloquesNASA,
  obtenerNoticiasUnaVez
};