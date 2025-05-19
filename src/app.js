const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Meter aquí las rutas de la API:
const noticiaRoutes = require('./routes/noticia_routes');
const usuarioRoutes = require('./routes/usuario_routes');
const categoriasRoutes = require('./routes/categorias_routes');

app.use('/api', noticiaRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', categoriasRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenido a la API de Noticias sobre el Espacio' });
});

module.exports = app;
