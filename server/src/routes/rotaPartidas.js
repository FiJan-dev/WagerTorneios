// routes/rotaPartidas.js
const express = require('express');
const router = express.Router();

const controllerPartida = require('../controllers/controllerPartidas.js');
const autenticarToken = require('../middleware/authmiddlaware');
const autenticaAdmin = require('../middleware/authAdmin');

// Listar: exige login
router.get('/listarP', autenticarToken, controllerPartida.listarPartidas);

// Cadastrar: somente admin
router.post('/registrarP', autenticarToken, autenticaAdmin, controllerPartida.registrarPartida);

module.exports = router;
