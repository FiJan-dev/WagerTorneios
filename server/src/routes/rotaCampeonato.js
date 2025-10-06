const express = require('express');
const router = express.Router();

const controllerCampeonato = require('../controllers/controllerCampeonato.js');
const autenticarToken = require('../middleware/authmiddlaware.js');

router.get('/listarC',controllerCampeonato.listarCampeonatos);
router.post('/criarC',controllerCampeonato.criarCampeonatos);

module.exports = router;