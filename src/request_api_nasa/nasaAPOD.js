const axios = require('axios');
const noticiaService = require('../services/noticia_service');
require('dotenv').config();

const API_KEY = process.env.NASA_API_KEY;

async function insertarNoticiaApiNasa() {
  const fechaRandom = generarFechaAleatoria();

  try {
    await insertarUnaNoticiaNasa(fechaRandom);
  } catch (error) {
    console.error('Error al obtener noticias de la Api Externa:', error.message);
  }
}

async function insertarUnaNoticiaNasa(fecha) {
  try {
    const noticia = await fetchNoticiaUnica(fecha);

    await noticiaService.añadirNoticiaNasa(noticia);
  } catch (error) {
    console.error("Error al insertar una noticia de la NASA:", error.message);
    return null;
  }
}

async function fetchNoticiaUnica(fecha) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${fecha.split('T')[0]}`;
  const response = await axios.get(url);
  const item = response.data;

  return {
    titulo: item.title || 'Sin título',
    contenido: item.explanation || 'Sin explicación',
    fecha: fecha,
  };
}

function generarFechaISOCompleta(fecha) {
  if (!(fecha instanceof Date)) {
    fecha = new Date(fecha);
  }
  return fecha.toISOString();
}

function generarFechaAleatoria() {
  const fechaInicio = new Date('2024-05-01');
  const fechaFin = new Date('2025-05-24');

  const timestamp = fechaInicio.getTime() + Math.random() * (fechaFin.getTime() - fechaInicio.getTime());
  const fechaAleatoria = new Date(timestamp);

  return generarFechaISOCompleta(fechaAleatoria);
}

module.exports = {
  insertarNoticiaApiNasa
};