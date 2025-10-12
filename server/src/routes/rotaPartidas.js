// routes/rotaPartidas.js
const express = require('express');
const router = express.Router();

const controllerPartida = require('../controllers/controllerPartidas.js');
const { autenticarTokenSoft, autenticaAdminSoft } = require('../middleware/authSoft.js');

// Listar: exige login (suave)
router.get('/listarP', autenticarTokenSoft, controllerPartida.listarPartidas);

// Cadastrar: somente admin (suave)
router.post('/registrarP', autenticarTokenSoft, autenticaAdminSoft, controllerPartida.registrarPartida);

module.exports = router;
