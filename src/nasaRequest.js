// Importar dependencias
const axios = require('axios');
const xml2js = require('xml2js'); // Para parsear XML a JSON
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Función para obtener la imagen del día (APOD) en JSON
const getAPOD = async () => {
  try {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      throw new Error('NASA_API_KEY no está configurada en el archivo .env');
    }
    const url = 'https://api.nasa.gov/planetary/apod?api_key=${apiKey}';
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error haciendo la petición a APOD:', error.message);
    throw error;
  }
};

// Función para obtener noticias de la NASA en XML (RSS Feed)
const getNASANews = async () => {
  try {
    const url = 'https://www.nasa.gov/rss/dyn/breaking_news.rss';
    const response = await axios.get(url);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    return result;
  } catch (error) {
    console.error('Error haciendo la petición a NASA News:', error.message);
    throw error;
  }
};

// Función para obtener imágenes del Mars Rover (Curiosity) en JSON
const getMarsRoverPhotos = async (sol = 1000) => {
  try {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      throw new Error('NASA_API_KEY no está configurada en el archivo .env');
    }
    const url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${apiKey}';
    const response = await axios.get(url);
    return response.data.photos;
  } catch (error) {
    console.error('Error obteniendo imágenes de Marte:', error.message);
    throw error;
  }
};

// Función para obtener asteroides cercanos a la Tierra (NEO)
const getNeoFeed = async (startDate, endDate) => {
  try {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      throw new Error('NASA_API_KEY no está configurada en el archivo .env');
    }
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}';
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo datos de asteroides:', error.message);
    throw error;
  }
};

// Función principal para ejecutar el script y mostrar datos
const main = async () => {
  try {
    // APOD
    const apodData = await getAPOD();
    console.log('Datos de la APOD (JSON):');
    console.log('-----------------------');
    console.log('Título: ${apodData.title}');
    console.log('Fecha: ${apodData.date}');
    console.log('Explicación: ${apodData.explanation}');
    console.log('URL de la imagen: ${apodData.url}');
    if (apodData.hdurl) {
      console.log('URL de la imagen en alta calidad: ${apodData.hdurl}');
    }
    console.log('Tipo de medio: ${apodData.media_type}');
    console.log('\n');

    // Noticias de la NASA (RSS)
    const newsData = await getNASANews();
    console.log('Noticias de la NASA (XML parseado a JSON):');
    console.log('-----------------------------------------');
    const newsItems = newsData.rss.channel[0].item;
    newsItems.forEach((item, index) => {
      console.log('Noticia ${index + 1}:');
      console.log('- Título: ${item.title[0]}');
      console.log('- Enlace: ${item.link[0]}');
      console.log('- Descripción: ${item.description[0]}');
      console.log('\n');
    });

    // Imágenes del Mars Rover (Curiosity) en el sol 1000
    const marsPhotos = await getMarsRoverPhotos(1000);
    console.log('Fotos del Mars Rover (Curiosity) en el sol 1000:');
    console.log('--------------------------------------------------');
    // Mostramos solo las primeras 5 imágenes para no saturar la consola
    marsPhotos.slice(0, 5).forEach((photo, index) => {
      console.log('Foto ${index + 1}:');
      console.log('- ID: ${photo.id}');
      console.log('- Cámara: ${photo.camera.full_name}');
      console.log('- Fecha de captura: ${photo.earth_date}');
      console.log('- URL: ${photo.img_src}');
      console.log('\n');
    });

    // Asteroides cercanos a la Tierra (NEO) en un rango de fechas
    const startDate = '2025-01-01';
    const endDate = '2025-01-07';
    const neoData = await getNeoFeed(startDate, endDate);
    console.log('Asteroides cercanos a la Tierra entre ${startDate} y ${endDate}:');
    console.log('------------------------------------------------------------------');
    for (const date in neoData.near_earth_objects) {
      console.log('Fecha: ${date}');
      neoData.near_earth_objects[date].forEach((asteroid, index) => {
        console.log('Asteroide ${index + 1}:');
        console.log('- Nombre: ${asteroid.name}');
        console.log(
          `- Tamaño estimado (metros): ${asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(
            2
          )} - ${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}`
        );
        console.log('- Potencialmente peligroso: ${asteroid.is_potentially_hazardous_asteroid}');
        if (asteroid.close_approach_data.length > 0) {
          console.log('- Fecha del acercamiento: ${asteroid.close_approach_data[0].close_approach_date}');
          console.log(
            `- Velocidad relativa (km/h): ${parseFloat(
              asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour
            ).toFixed(2)}`
          );
        }
        console.log('\n');
      });
    }
  } catch (error) {
    console.error('Error en el script:', error.message);
  }
};

// Ejecutar la función principal
main();