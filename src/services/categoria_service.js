const { getCategoriasCollection, ObjectId } = require('../config/database');
const noticiaService = require('../services/noticia_service');

const crearCategoria = async (datos) => {
  try {
    const categoriasCollection = getCategoriasCollection();
    const resultado = await categoriasCollection.insertOne(datos);
    return { _id: resultado.insertedId, ...datos };
  } catch (error) {
    throw new Error('Error al crear la categoria: ' + error.message);
  }
};

const obtenerCategorias = async () => {
  try {
    const categoriasCollection = getCategoriasCollection();
    const categorias = await categoriasCollection.find().toArray();
    return categorias;
  } catch (error) {
    throw new Error('Error al obtener las categorías: ' + error.message);
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias
};
