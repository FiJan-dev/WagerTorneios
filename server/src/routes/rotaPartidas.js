const express = require('express');
const router = express.Router();

const controllerPartida = require('../controllers/controllerPartidas.js'); 
const autenticarToken = require('../middleware/authmiddlaware.js');

router.get('/listarP',controllerPartida.listarPartidas); 
router.post('/registrarP',controllerPartida.registrarPartida);

module.exports = router;