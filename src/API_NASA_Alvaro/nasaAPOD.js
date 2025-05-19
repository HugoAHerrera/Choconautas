const axios = require('axios');

const API_KEY = 'DEMO_KEY'; // Pon aquí tu clave si tienes una
const startDate = '2023-05-10'; // Cambia aquí la fecha desde la que quieres noticias (AAAA-MM-DD)
const endDate = '2025-05-19';   // Hasta cuándo (o déjalo igual a hoy)

const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

axios.get(url)
  .then(respuesta => {
    const noticias = respuesta.data;

    console.log("📰 NOTICIAS NASA - ASTRONOMY PICTURES OF THE DAY");
    console.log("==============================================");

    noticias.forEach((noticia, index) => {
      console.log(`\n🔢 Noticia #${index + 1}`);
      console.log(`📅 Fecha: ${noticia.date}`);
      console.log(`🧠 Título: ${noticia.title}`);
      console.log(`📝 Contenido:\n${noticia.explanation}`);
      console.log("==============================================");
    });
  })
  .catch(error => {
    if (error.response && error.response.status === 403) {
      console.error("❌ Error 403: Clave API inválida o límite superado.");
    } else {
      console.error("Error al obtener las noticias APOD:", error.message);
    }
  });
