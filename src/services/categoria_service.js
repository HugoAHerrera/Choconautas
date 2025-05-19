const { getCategoriasCollection, ObjectId } = require('../config/database');

const crearCategoria = async (datos) => {
  try {
    const categoriasCollection = getCategoriasCollection();
    const resultado = await categoriasCollection.insertOne(datos);
    return { _id: resultado.insertedId, ...datos };
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
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

const obtenerCategoriaPorId = async (id) => {
  try {
    const categoriasCollection = getCategoriasCollection();
    const categoria = await categoriasCollection.findOne({ _id: ObjectId(id) });
    return categoria;
  } catch (error) {
    throw new Error('Error al obtener la categoría: ' + error.message);
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
};
