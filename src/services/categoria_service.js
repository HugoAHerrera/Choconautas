const { getCategoriasCollection, ObjectId } = require('../config/database');

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
  obtenerCategorias,
  obtenerCategoriaPorId,
};
