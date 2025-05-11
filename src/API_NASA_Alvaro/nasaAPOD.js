// Importar dependencias
const axios = require('axios');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Definir la función para obtener la imagen del día (APOD)
const getAPOD = async () => {
    try {
        // Obtener la API key desde las variables de entorno
        const apiKey = process.env.NASA_API_KEY;

        // Verificar si la API key está configurada
        if (!apiKey) {
            throw new Error('NASA_API_KEY no está configurada en el archivo .env');
        }

        // URL de la NASA API APOD
        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

        // Hacer la solicitud a la API
        const response = await axios.get(url);

        // Devolver los datos obtenidos
        return response.data;
    } catch (error) {
        console.error('Error fetching APOD:', error.message);
        throw error;
    }
};

// Función principal para ejecutar el script
const main = async () => {
    try {
        // Obtener los datos de la APOD
        const apodData = await getAPOD();

        // Mostrar los datos en la consola
        console.log('Datos de la APOD:');
        console.log('-----------------');
        console.log(`Título: ${apodData.title}`);
        console.log(`Fecha: ${apodData.date}`);
        console.log(`Explicación: ${apodData.explanation}`);
        console.log(`URL de la imagen: ${apodData.url}`);
        if (apodData.hdurl) {
            console.log(`URL de la imagen en alta calidad: ${apodData.hdurl}`);
        }
        console.log(`Tipo de medio: ${apodData.media_type}`);
    } catch (error) {
        console.error('Error en el script:', error.message);
    }
};

// Ejecutar la función principal
main();