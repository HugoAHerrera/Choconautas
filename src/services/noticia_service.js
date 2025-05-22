const { getNoticiasCollection, ObjectId, getUsuariosCollection, getCategoriasCollection } = require('../config/database');

const crearNoticia = async (noticiaData) => {
  try {
    const noticiasCollection = getNoticiasCollection();
    
    const usuario = await getUsuariosCollection().findOne({ _id: ObjectId(noticiaData.autorId) });
    const categoria = await getCategoriasCollection().findOne({ _id: ObjectId(noticiaData.categoriaId) });

    if (!usuario || !categoria) {
      throw new Error('Usuario o categoría no encontrados');
    }

    const noticia = {
      titulo: noticiaData.titulo,
      contenido: noticiaData.contenido,
      fecha: new Date(),
      autorId: ObjectId(noticiaData.autorId),
      categoriaId: ObjectId(noticiaData.categoriaId),
    };

    const result = await noticiasCollection.insertOne(noticia);
    return result.ops[0];

  } catch (error) {
    throw new Error('Error al crear la noticia: ' + error.message);
  }
};

const obtenerNoticias = async (pagina = 1, limite = 10, categoria, fechaInicio, fechaFin) => {
  try {
    const noticiasCollection = getNoticiasCollection();

    const skip = (pagina - 1) * limite;
    const filtro = {};

    if (categoria) filtro.categoriaId = ObjectId(categoria);
    if (fechaInicio) filtro.fecha = { $gte: new Date(fechaInicio) };
    if (fechaFin) filtro.fecha = { $lte: new Date(fechaFin) };

    const noticias = await noticiasCollection
      .find(filtro)
      .skip(skip)
      .limit(parseInt(limite))
      .toArray();

    return noticias;

  } catch (error) {
    throw new Error('Error al obtener las noticias: ' + error.message);
  }
};

const obtenerNoticiasPorFecha = async (fecha) => {
  try {
    const noticiasCollection = getNoticiasCollection();

    const noticias = await noticiasCollection.find({
      fecha: { $regex: `^${fecha}` }
    }).toArray();

    return noticias;

  } catch (error) {
    throw new Error('Error al obtener noticias por fecha: ' + error.message);
  }
};

const obtenerNoticiaPorId = async (id) => {
  const noticiasCollection = getNoticiasCollection();
  return await noticiasCollection.findOne({ _id: Number(id) });
};

const actualizarNoticiaPorId = async (id, nuevosDatos) => {
  const noticiasCollection = getNoticiasCollection();

  const resultado = await noticiasCollection.findOneAndUpdate(
    { _id: Number(id) },
    { $set: nuevosDatos },
    { returnDocument: 'after' }
  );

  return resultado.value;
};

const borrarNoticiaPorId = async (id) => {
  const noticiasCollection = getNoticiasCollection();

  const resultado = await noticiasCollection.deleteOne({ _id: Number(id) });

  return resultado.deletedCount > 0;
};

const obtenerNoticiasPorRangoAutorId = async (min, max) => {
  try {
    const noticiasCollection = getNoticiasCollection();

    const noticias = await noticiasCollection.find({
      autorId: { $gte: min, $lte: max }
    }).toArray();

    return noticias;

  } catch (error) {
    throw new Error('Error al obtener noticias por rango de autorId: ' + error.message);
  }
};

const fetchNoticiasNASASinAPI = async (fecha) => {
  try {
  const noticiasCollection = getNoticiasCollection();

  const noticias = await noticiasCollection.find({
    fecha: { $regex: `^${fecha}` },
    autorId: { $gte: 20, $lte: 30 }
  }).toArray();

  return noticias;

} catch (error) {
  throw new Error('Error al obtener noticias por fecha y autorId: ' + error.message);
}
};


module.exports = {
  crearNoticia,
  obtenerNoticias,
  fetchNoticiasNASASinAPI,
  obtenerNoticiasPorFecha,
  obtenerNoticiaPorId,
  actualizarNoticiaPorId,
  borrarNoticiaPorId,
  obtenerNoticiasPorRangoAutorId
};
