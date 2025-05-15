const { getUsuariosCollection, getNoticiasCollection, ObjectId } = require('../config/database');

const obtenerUsuarioPorId = async (id) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const usuario = await usuariosCollection.findOne({ _id: new ObjectId(id) });
    return usuario;
  } catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
};

const crearUsuario = async (datos) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const resultado = await usuariosCollection.insertOne(datos);
    return { _id: resultado.insertedId, ...datos };
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};

const actualizarUsuario = async (id, datos) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const resultado = await usuariosCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: datos },
      { returnDocument: 'after' } 
    );
    return resultado.value; 
  } catch (error) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
};

const eliminarUsuario = async (id) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const resultado = await usuariosCollection.deleteOne({ _id: new ObjectId(id) });
    return resultado.deletedCount > 0;
  } catch (error) {
    throw new Error('Error al eliminar el usuario: ' + error.message);
  }
};

const obtenerNoticiasDeUsuario = async (usuarioId) => {
  try {
    const noticiasCollection = getNoticiasCollection();
    const noticias = await noticiasCollection.find({ autorId: usuarioId }).toArray();
    return noticias;
  } catch (error) {
    throw new Error('Error al obtener noticias del usuario: ' + error.message);
  }
};

module.exports = {
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerNoticiasDeUsuario,
};
