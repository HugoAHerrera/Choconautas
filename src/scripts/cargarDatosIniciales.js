const { MongoClient } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const cargarDatos = async () => {
  try {
    await client.connect();
    const db = client.db('choconautas');

    const usuarios = JSON.parse(fs.readFileSync('datasets/usuarios.json', 'utf8'));
    const categorias = JSON.parse(fs.readFileSync('datasets/categorias.json', 'utf8'));
    const noticias = JSON.parse(fs.readFileSync('datasets/noticias.json', 'utf8'));
    const comentarios = JSON.parse(fs.readFileSync('datasets/comentarios.json', 'utf8'));

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
