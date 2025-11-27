const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerNotas');
const autenticarToken = require('../middleware/authmiddlaware');
const autenticarTokenSoft = require('../middleware/authSoft');

// Avaliar ou atualizar nota (obrigatório login)
router.post('/', autenticarToken, controller.avaliarJogador);

// Ver média do jogador
router.get('/media/:id', autenticarTokenSoft, controller.getMediaJogador);

// Minhas notas (obrigatório login)
router.get('/minhas', autenticarToken, controller.minhasNotas);

module.exports = router;