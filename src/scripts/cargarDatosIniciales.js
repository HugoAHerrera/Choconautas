const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Convertir $oid en ObjectId
function convertirOid(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertirOid);
  } else if (obj && typeof obj === 'object') {
    if ('$oid' in obj) return new ObjectId(obj['$oid']);
    const nuevo = {};
    for (const clave in obj) {
      nuevo[clave] = convertirOid(obj[clave]);
    }
    return nuevo;
  }
  return obj;
}

const cargarDatos = async () => {
  try {
    await client.connect();
    const db = client.db('choconautas');

    const usuarios = convertirOid(JSON.parse(fs.readFileSync('datasets/usuarios.json', 'utf8')));
    const categorias = convertirOid(JSON.parse(fs.readFileSync('datasets/categorias.json', 'utf8')));
    const noticias = convertirOid(JSON.parse(fs.readFileSync('datasets/noticias.json', 'utf8')));
    const comentarios = convertirOid(JSON.parse(fs.readFileSync('datasets/comentarios.json', 'utf8')));

    await db.collection('usuarios').insertMany(usuarios);
    await db.collection('categorias').insertMany(categorias);
    await db.collection('noticias').insertMany(noticias);
    await db.collection('comentarios').insertMany(comentarios);

    console.log('Datos iniciales cargados correctamente.');
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  } finally {
    await client.close();
  }
};

cargarDatos();
