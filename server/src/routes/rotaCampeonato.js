// routes/rotaCampeonato.js
const express = require('express');
const router = express.Router();

const controllerCampeonato = require('../controllers/controllerCampeonato.js');
const autenticarToken = require('../middleware/authmiddlaware');
const autenticaAdmin = require('../middleware/authAdmin');

// Listar: exige login
router.get('/listarC', autenticarToken, controllerCampeonato.listarCampeonatos);

// Criar: somente admin
router.post('/criarC', autenticarToken, autenticaAdmin, controllerCampeonato.criarCampeonatos);

module.exports = router;
