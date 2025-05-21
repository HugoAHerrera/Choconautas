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

async function obtenerNoticiasEnBloquesNASA(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  const noticiasTotales = [];

  while (start <= end) {
    let bloqueEnd = addDays(start, 9);
    if (bloqueEnd > end) bloqueEnd = end;

    try {
      const noticias = await fetchNoticias(formatDate(start), formatDate(bloqueEnd));
      noticiasTotales.push(...noticias);
    } catch (error) {
      console.error(`❌ Error al obtener noticias del ${formatDate(start)} al ${formatDate(bloqueEnd)}:`, error.message);
    }

    start = addDays(bloqueEnd, 1);
    await delay(1000); // Espera 1 segundo entre bloques
  }

  return noticiasTotales;
}


module.exports = {
  fetchNoticias,
  obtenerNoticiasEnBloquesNASA
};
