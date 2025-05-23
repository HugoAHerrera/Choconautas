const { exec } = require('child_process');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB = 'choconautas';

const colecciones = ['usuarios', 'categorias', 'noticias', 'comentarios'];

async function importarDatos() {
  for (const coleccion of colecciones) {
    const cmd = `mongoimport --uri="${MONGO_URI}" --db=${DB} --collection=${coleccion} --file=datasets/${coleccion}.json --jsonArray --drop`;
    console.log(`Importando ${coleccion}...`);
    
    try {
      await new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error importando ${coleccion}:`, error);
            return reject(error);
          }
          if (stderr) console.error(stderr);
          console.log(stdout);
          resolve();
        });
      });
    } catch {
      console.error(`Fallo la importación de ${coleccion}`);
      process.exit(1);
    }
  }
  console.log('Importación finalizada.');
}

importarDatos();

