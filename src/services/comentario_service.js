const { getComentariosCollection, getNoticiasCollection } = require('../config/database');

const crearComentarioEnNoticia = async (noticiaId, comentarioData) => {
  try {
    const noticiasCollection = getNoticiasCollection();
    const noticia = await noticiasCollection.findOne({ _id: noticiaId });

    if (!noticia) throw new Error('Noticia no encontrada');

    const comentariosCollection = getComentariosCollection();

    const comentario = {
      noticiaId: noticiaId,
      autor: comentarioData.autor,
      contenido: comentarioData.contenido,
      fecha: new Date()
    };

    const result = await comentariosCollection.insertOne(comentario);
    return { _id: result.insertedId, ...comentario };

  } catch (error) {
    throw new Error('Error al crear comentario: ' + error.message);
  }
};

const borrarComentariosDeNoticia = async (noticiaId) => {
  try {
    const noticiasCollection = getNoticiasCollection();
    const noticia = await noticiasCollection.findOne({ _id: noticiaId });

    if (!noticia) return false;

    const comentariosCollection = getComentariosCollection();
    await comentariosCollection.deleteMany({ noticiaId: noticiaId });
    return true;
  } catch (error) {
    throw new Error('Error al borrar comentarios: ' + error.message);
  }
};

const obtenerComentariosDeNoticia = async (noticiaId) => {
  try {
    const comentariosCollection = getComentariosCollection();

    const comentarios = await comentariosCollection.find({ noticiaId: noticiaId }).toArray();
    return comentarios;

  } catch (error) {
    throw new Error('Error al obtener comentarios: ' + error.message);
  }
};

const obtenerComentarioPorId = async (noticiaId, comentarioId) => {
  try {
    const comentariosCollection = getComentariosCollection();

    const comentario = await comentariosCollection.findOne({
      noticiaId: noticiaId,
      _id: comentarioId
    });

    return comentario;
  } catch (error) {
    throw new Error('Error al obtener comentario: ' + error.message);
  }
};

const actualizarComentario = async (noticiaId, comentarioId, nuevosDatos) => {
  try {
    const comentariosCollection = getComentariosCollection();

    const resultado = await comentariosCollection.findOneAndUpdate(
      {
        noticiaId: noticiaId,
        _id: comentarioId
      },
      {
        $set: {
          contenido: nuevosDatos.contenido,
          autorId: nuevosDatos.autorId,
          fecha: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    return resultado.value;
  } catch (error) {
    throw new Error('Error al actualizar comentario: ' + error.message);
  }
};

const borrarComentarioPorId = async (noticiaId, comentarioId) => {
  try {
    const comentariosCollection = getComentariosCollection();

    const resultado = await comentariosCollection.deleteOne({
      noticiaId: noticiaId,
      _id: comentarioId
    });

    return resultado.deletedCount > 0;
  } catch (error) {
    throw new Error('Error al borrar comentario: ' + error.message);
  }
};

module.exports = {
  obtenerComentariosDeNoticia,
  crearComentarioEnNoticia,
  borrarComentariosDeNoticia,
  obtenerComentarioPorId,
  actualizarComentario,
  borrarComentarioPorId
};