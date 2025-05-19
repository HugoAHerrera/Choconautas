const axios = require('axios');

const API_KEY = 'DEMO_KEY'; // Pon tu API key aquí
const startDate = '2023-05-01'; // Fecha de inicio (AAAA-MM-DD)
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

async function obtenerNoticiasEnBloques(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  const noticiasTotales = [];

  while (start <= end) {
    let bloqueEnd = addDays(start, 9);
    if (bloqueEnd > end) bloqueEnd = end;

    const noticias = await fetchNoticias(formatDate(start), formatDate(bloqueEnd));
    noticiasTotales.push(...noticias);

    start = addDays(bloqueEnd, 1);
  }

  return noticiasTotales;
}

(async () => {
  try {
    const noticias = await obtenerNoticiasEnBloques(startDate, endDate);

    console.log("📰 NOTICIAS NASA - ASTRONOMY PICTURES OF THE DAY");
    console.log("==============================================");

    noticias.forEach((noticia, index) => {
      console.log(`\n🔢 Noticia #${index + 1}`);
      console.log(`📅 Fecha: ${noticia.date}`);
      console.log(`🧠 Título: ${noticia.title}`);
      console.log(`📝 Explicación:\n${noticia.explanation}`);
      console.log(`🎬 Tipo media: ${noticia.media_type}`);
      console.log(`🔗 URL: ${noticia.url}`);
      if (noticia.hdurl) console.log(`🔗 URL HD: ${noticia.hdurl}`);
      console.log("==============================================");
    });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error("❌ Error 403: Clave API inválida o límite superado.");
    } else {
      console.error("Error al obtener las noticias APOD:", error.message);
    }
  }
})();
