const categoriaService = require('../services/categoria_service');
const noticiaService = require('../services/noticia_service');

// POST /categoria
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevaCategoria = await categoriaService.crearCategoria({ nombre, descripcion });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoria', error: error.message });
  }
};

// GET /categorias
const obtenerTodasCategorias = async (req, res) => {
    try {
     const categorias = await categoriaService.obtenerCategorias();
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo la lista de categorias', error: error.message });
    }
  };

// GET /categorias/{categoriaId}
const obtenerCategoriaConId = async (req, res) => {
  try {
    const categoriaId = req.params['categoriaId'];

    const noticias = await noticiaService.obtenerNoticiasPorId(categoriaId);

    if (!noticias || noticias.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada o sin noticias' });
    }
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo la categoria indicada', error: error.message });
  }
};

module.exports = {
  crearCategoria,
  obtenerTodasCategorias,
  obtenerCategoriaConId,
};
