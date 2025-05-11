const { getUsuariosCollection, ObjectId } = require('../config/database');

const obtenerUsuarioPorId = async (id) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const usuario = await usuariosCollection.findOne({ _id: ObjectId(id) });
    return usuario;
  } catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
};

module.exports = {
  obtenerUsuarioPorId,
};
