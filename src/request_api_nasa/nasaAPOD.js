const axios = require('axios');

const API_KEY = 'DEMO_KEY'; // Pon tu API key aquí
const startDate = '2025-05-05'; // Fecha de inicio (AAAA-MM-DD)
const endDate = '2025-05-19';   // Fecha final (AAAA-MM-DD)

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function fetchNoticias(start, end) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;
  const response = await axios.get(url);
  return response.data;
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const fs = require('fs');
const path = require('path');

async function obtenerNoticiasEnBloquesNASA(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  const nuevasNoticias = [];

  while (start <= end) {
    let bloqueEnd = addDays(start, 9);
    if (bloqueEnd > end) bloqueEnd = end;

    try {
      const noticias = await fetchNoticias(formatDate(start), formatDate(bloqueEnd));
      noticias.forEach(noticia => {
        nuevasNoticias.push({
          titulo: noticia.title,
          contenido: noticia.explanation,
          fecha: noticia.date,
          autorId: getRandomInt(20, 30),
          categoriaId: getRandomInt(1, 7)
        });
      });
    } catch (error) {
      console.error(`❌ Error al obtener noticias del ${formatDate(start)} al ${formatDate(bloqueEnd)}:`, error.message);
    }

    start = addDays(bloqueEnd, 1);
    await delay(1000);
  }

  const noticiasPath = './datasets/noticias.json';

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

  // Calcular el próximo _id
  let ultimoId = noticiasExistentes.length > 0 ? Math.max(...noticiasExistentes.map(n => n._id || 0)) : 0;

  // Asignar _id y agregar al final
  nuevasNoticias.forEach(noticia => {
    noticia._id = ++ultimoId;
    noticiasExistentes.push(noticia);
  });

  // Guardar el array completo sin borrar lo anterior
  fs.writeFileSync(noticiasPath, JSON.stringify(noticiasExistentes, null, 4), 'utf-8');

  return nuevasNoticias;
}



module.exports = {
  fetchNoticias,
  obtenerNoticiasEnBloquesNASA
};
