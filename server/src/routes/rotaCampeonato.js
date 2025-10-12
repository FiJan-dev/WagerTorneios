// routes/rotaCampeonato.js
const express = require('express');
const router = express.Router();

const controllerCampeonato = require('../controllers/controllerCampeonato.js');
const { autenticarTokenSoft, autenticaAdminSoft } = require('../middleware/authSoft.js');

// Listar: exige login (suave)
router.get('/listarC', autenticarTokenSoft, controllerCampeonato.listarCampeonatos);

// Criar: somente admin (suave)
router.post('/criarC', autenticarTokenSoft, autenticaAdminSoft, controllerCampeonato.criarCampeonatos);

module.exports = router;
