const { getCategoriasCollection } = require('../config/database');

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

const obtenerCategoriaRandom = async () => {
  try {
    const categoriasCollection = getCategoriasCollection();
    const count = await categoriasCollection.countDocuments();
    if (count === 0) return null;

    const randomIndex = Math.floor(Math.random() * count);
    const categoria = await categoriasCollection.find().limit(1).skip(randomIndex).next();

    return categoria;
  } catch (error) {
    throw new Error('Error al obtener categoría aleatoria: ' + error.message);
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaRandom
};
