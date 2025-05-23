const { getNoticiasCollection, ObjectId, getUsuariosCollection, getCategoriasCollection } = require('../config/database');

const crearNoticia = async (noticiaData) => {
  try {
    const noticiasCollection = getNoticiasCollection();

    const autorObjectId = new ObjectId(noticiaData.autorId);
    const categoriaObjectId = new ObjectId(noticiaData.categoriaId);

    const usuario = await getUsuariosCollection().findOne({ _id: autorObjectId });
    const categoria = await getCategoriasCollection().findOne({ _id: categoriaObjectId });

    if (!usuario || !categoria) {
      throw new Error('Usuario o categoría no encontrados');
    }

    const noticia = {
      titulo: noticiaData.titulo,
      contenido: noticiaData.contenido,
      fecha: new Date(),
      autorId: autorObjectId,
      categoriaId: categoriaObjectId,
    };

    const result = await noticiasCollection.insertOne(noticia);
    const noticiaCreada = await noticiasCollection.findOne({ _id: result.insertedId });
    return noticiaCreada;

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

const obtenerNoticiasPorFecha = async (inicioDia, finDia) => {
  const noticiasCollection = getNoticiasCollection();
  return await noticiasCollection.find({
    fecha: {
      $gte: inicioDia,
      $lte: finDia
    }
  }).toArray();
};

const obtenerNoticiasNasaPorFecha = async (fecha) => {
  try {
    const noticiasCollection = getNoticiasCollection();

    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(new Date(fecha).setUTCHours(23, 59, 59, 999));

    const noticias = await noticiasCollection.find({
      fecha: { $gte: fechaInicio, $lte: fechaFin },
      autorId: "682f2d781c60e1f60c175753"
    }).toArray();

    return noticias;
  } catch (error) {
    throw new Error('Error al obtener noticias por fecha: ' + error.message);
  }
};


const obtenerNoticiaPorId = async (id) => {
  const noticiasCollection = getNoticiasCollection();
  return await noticiasCollection.findOne({ _id: id });
};

const actualizarNoticiaPorId = async (id, nuevosDatos) => {
  const noticiasCollection = getNoticiasCollection();

  const resultado = await noticiasCollection.findOneAndUpdate(
    { _id: id },
    { $set: nuevosDatos },
    { returnDocument: 'after' }
  );

  return resultado.value;
};

const borrarNoticiaPorId = async (id) => {
  const noticiasCollection = getNoticiasCollection();

  const resultado = await noticiasCollection.deleteOne({ _id: id });

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

const obtenerNoticiasNasa = async () => {
  try {
    const noticiasCollection = getNoticiasCollection();
    const noticias = await noticiasCollection
      .find({ autorId: "682f2d781c60e1f60c175753" })
      .toArray();
    return noticias;
  } catch (error) {
    throw new Error('Error al obtener noticias de la NASA: ' + error.message);
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
  obtenerNoticiasPorRangoAutorId,
  obtenerNoticiasNasa,
  obtenerNoticiasNasaPorFecha
};
