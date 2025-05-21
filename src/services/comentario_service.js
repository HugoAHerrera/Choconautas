const { getComentariosCollection, ObjectId, getNoticiasCollection } = require('../config/database');

const crearComentarioEnNoticia = async (noticiaId, comentarioData) => {
  try {
    const noticiasCollection = getNoticiasCollection();
    const noticia = await noticiasCollection.findOne({ _id: Number(noticiaId) });

    if (!noticia) throw new Error('Noticia no encontrada');

    const comentariosCollection = getComentariosCollection();

    const ultimoComentario = await comentariosCollection
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    const nuevoId = ultimoComentario.length ? ultimoComentario[0]._id + 1 : 1;

    const comentario = {
      _id: nuevoId,
      noticiaId: Number(noticiaId),
      autor: comentarioData.autor,
      contenido: comentarioData.contenido,
      fecha: new Date()
    };

    const result = await comentariosCollection.insertOne(comentario);
    return result.ops[0];
  } catch (error) {
    throw new Error('Error al crear comentario: ' + error.message);
  }
};

const borrarComentariosDeNoticia = async (noticiaId) => {
  try {
    const noticiasCollection = getNoticiasCollection();
    const noticia = await noticiasCollection.findOne({ _id: Number(noticiaId) });

    if (!noticia) return false;

    const comentariosCollection = getComentariosCollection();
    await comentariosCollection.deleteMany({ noticiaId: Number(noticiaId) });
    return true;
  } catch (error) {
    throw new Error('Error al borrar comentarios: ' + error.message);
  }
};

const obtenerComentariosDeNoticia = async (noticiaId) => {
  try {
    const comentariosCollection = getComentariosCollection();

    const comentarios = await comentariosCollection.find({
      noticiaId: Number(noticiaId)
    }).toArray();

    return comentarios;

  } catch (error) {
    throw new Error('Error al obtener comentarios: ' + error.message);
  }
};

const obtenerComentarioPorId = async (noticiaId, comentarioId) => {
  try {
    const comentariosCollection = getComentariosCollection();

    const comentario = await comentariosCollection.findOne({
      noticiaId: Number(noticiaId),
      _id: Number(comentarioId)
    });

    return comentario;
  } catch (error) {
    throw new Error('Error al obtener comentario: ' + error.message);
  }
};

module.exports = {
  obtenerComentariosDeNoticia,
  crearComentarioEnNoticia,
  borrarComentariosDeNoticia,
  obtenerComentarioPorId
};