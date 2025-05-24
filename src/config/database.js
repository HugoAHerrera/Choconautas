const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

// Cargar las variables de entorno del .env
dotenv.config();

// Variables de entorno
const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};

const dbname = "choconautas"; 
const db = client.db(dbname);

const getNoticiasCollection = () => {
  return db.collection("noticias");
};

const getUsuariosCollection = () => {
  return db.collection("usuarios");
};

const getCategoriasCollection = () => {
  return db.collection("categorias");
};

const getComentariosCollection = () => {
  return db.collection("comentarios");
};

module.exports = {
  connectToDatabase,
  getNoticiasCollection,
  getUsuariosCollection,
  getCategoriasCollection,
  getComentariosCollection,
  ObjectId,
};
