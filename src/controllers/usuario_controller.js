const usuarioService = require('../services/usuario_service');

// POST /usuarios
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevoUsuario = await usuarioService.crearUsuario({
      nombre,
      email,
      fechaRegistro: new Date(),
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el usuario',
      error: error.message,
    });
  }
};

// GET /usuarios/:usuarioId
const obtenerNoticiasDeUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const usuario = await usuarioService.obtenerUsuarioPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const noticias = await usuarioService.obtenerNoticiasDeUsuario(usuarioId);

    if (!noticias || noticias.length === 0) {
      return res.status(201).json({ message: 'Usuario sin publicaciones' });
    }

    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo publicaciones del usuario',
      error: error.message,
    });
  }
};

// PUT /usuarios/:usuarioId
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const datos = req.body;

    if (!datos.nombre && !datos.email) {
      return res.status(400).json({ message: 'Datos inválidos para actualizar' });
    }

    const actualizado = await usuarioService.actualizarUsuario(usuarioId, datos);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({
      message: 'Error actualizando el usuario',
      error: error.message,
    });
  }
};

// DELETE /usuarios/:usuarioId
const eliminarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const eliminado = await usuarioService.eliminarUsuario(usuarioId);

    if (!eliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Error eliminando el usuario',
      error: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerNoticiasDeUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
