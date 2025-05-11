const app = require('./app');
const { MongoClient } = require('mongodb');
const { execSync } = require('child_process');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const checkAndLoadData = async () => {
  try {
    await client.connect();
    const db = client.db('choconautas');

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    const required = ['usuarios', 'categorias', 'noticias', 'comentarios'];
    const missingOrEmpty = [];

    for (const name of required) {
      if (!collectionNames.includes(name)) {
        missingOrEmpty.push(name);
      } else {
        const count = await db.collection(name).countDocuments();
        if (count === 0) missingOrEmpty.push(name);
      }
    }

    if (missingOrEmpty.length > 0) {
      console.log(`Colecciones faltantes o vacías: ${missingOrEmpty.join(', ')}`);
      console.log('Cargando datos iniciales...');
      execSync('node src/scripts/cargarDatosIniciales.js', { stdio: 'inherit' });
    } else {
      console.log('Base de datos previamente cargada');
    }

  } catch (err) {
    console.error('Error al comprobar/cargar datos:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
};

const startServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
};

checkAndLoadData().then(startServer);

