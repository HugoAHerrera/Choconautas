const { getUsuariosCollection, getNoticiasCollection } = require('../config/database');

// GET usuario por ID (string)
const obtenerUsuarioPorId = async (id) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const usuario = await usuariosCollection.findOne({ _id: id });
    return usuario;
  } catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
};

// POST usuario
const crearUsuario = async (datos) => {
  try {
    const usuariosCollection = getUsuariosCollection();

    // Crear ID único como string (puedes usar UUID u otro sistema)
    const nuevoId = crypto.randomUUID(); // o usa otro generador si prefieres
    const usuarioConId = { _id: nuevoId, ...datos };

    await usuariosCollection.insertOne(usuarioConId);
    return usuarioConId;
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};

// PUT usuario
const actualizarUsuario = async (id, datos) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const resultado = await usuariosCollection.findOneAndUpdate(
      { _id: id },
      { $set: datos },
      { returnDocument: 'after' }
    );

    return resultado.value;
  } catch (error) {
    throw new Error('Error al actualizar el usuario: ' + error.message);
  }
};

// DELETE usuario
const eliminarUsuario = async (id) => {
  try {
    const usuariosCollection = getUsuariosCollection();
    const resultado = await usuariosCollection.deleteOne({ _id: id });
    return resultado.deletedCount > 0;
  } catch (error) {
    throw new Error('Error al eliminar el usuario: ' + error.message);
  }
};

// GET noticias por autorId (también string)
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
