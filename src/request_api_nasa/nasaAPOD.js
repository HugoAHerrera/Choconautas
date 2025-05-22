const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 🔐 API key de NASA
const API_KEY = 'SA0hBTH3ILI5dHrrxSFuodjtoCgUKKdedmDeaP5e'; // Pon tu API key aquí

// 🔧 Configuración
const BLOQUE_DIAS = 5;
const DELAY_MS = 3000; // Puedes ajustar esto si hay rate limiting

// Utilidades
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fetch a la API

function getRandomInt(min, max) {
  // Devuelve un entero aleatorio entre min y max, ambos incluidos
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchNoticias(start, end) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;
  const response = await axios.get(url);

  const noticias = response.data.map(item => ({
    titulo: item.title,
    contenido: item.explanation,
    fecha: item.date,
    autorId: getRandomInt(20, 30),
    categoriaId: getRandomInt(1, 7),
  }));

  return noticias;
}


async function obtenerNoticiasEnBloquesNASA(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  const nuevasNoticias = [];

  // ← Agregar aquí: Obtener categorías válidas desde MongoDB
  const categorias = await getCategoriasCollection().find().toArray();
  const categoriaIds = categorias.map(cat => cat._id); // pueden ser ObjectId o strings

  while (start <= end) {
    let bloqueEnd = addDays(start, BLOQUE_DIAS - 1);
    if (bloqueEnd > end) bloqueEnd = end;

    try {
      const noticias = await fetchNoticias(formatDate(start), formatDate(bloqueEnd));
      noticias.forEach(noticia => {
        nuevasNoticias.push({
          titulo: noticia.title || 'Sin título',
          contenido: noticia.explanation || 'Sin explicación',
          fecha: noticia.date || formatDate(start),
          autorId: "682f2d781c60e1f60c175753", // ← fijo, tipo string
          categoriaId: categoriaIds[Math.floor(Math.random() * categoriaIds.length)] // ← real, aleatorio
        });
      });
    } catch (error) {
      console.error(`Error al obtener noticias del ${formatDate(start)} al ${formatDate(bloqueEnd)}:`, error.message);
    }

    start = addDays(bloqueEnd, 1);
    await delay(DELAY_MS);
  }

  const noticiasPath = path.resolve(__dirname, '../../datasets/noticias.json');

  let noticiasExistentes = [];

  // Leer noticias existentes sin sobrescribir
  if (fs.existsSync(noticiasPath)) {
    try {
      const contenido = fs.readFileSync(noticiasPath, 'utf-8');
      noticiasExistentes = JSON.parse(contenido);
    } catch (error) {
      console.error('⚠️ Error al leer o parsear noticias.json:', error.message);
      return;
    }
  }

  // Calcular próximo _id seguro
  const idsExistentes = noticiasExistentes
    .map(n => n._id)
    .filter(id => typeof id === 'number');
  let ultimoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) : 0;

  // Asignar _id y agregar solo si no existe duplicado por título
  nuevasNoticias.forEach(noticia => {
    const existe = noticiasExistentes.some(n => n.titulo === noticia.titulo);
    if (!existe) {
      noticia = { _id: ++ultimoId, ...noticia };
      noticiasExistentes.push(noticia);
    }
  });

  // Guardar el array completo
  fs.writeFileSync(noticiasPath, JSON.stringify(noticiasExistentes, null, 4), 'utf-8');

  return nuevasNoticias;
}

// Exportación de funciones
module.exports = {
  fetchNoticias,
  obtenerNoticiasEnBloquesNASA
};
