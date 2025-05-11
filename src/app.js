const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const noticiaRoutes = require('./routes/noticia_routes');

app.use('/api', noticiaRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenido a la API de Noticias sobre el Espacio' });
});

module.exports = app;
