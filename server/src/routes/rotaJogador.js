// routes/rotaJogador.js
const express = require('express');
const router = express.Router();

const controllerJogador = require('../controllers/controllerJogador');
const autenticarToken = require('../middleware/authmiddlaware');
const autenticaAdmin = require('../middleware/authAdmin');

// Rotas Jogador
router.post('/cadastrar', autenticarToken, autenticaAdmin, controllerJogador.cadastrarJogador);
router.get('/listar', autenticarToken, controllerJogador.listarJogadores);
router.put('/atualizar/:id', autenticarToken, autenticaAdmin, controllerJogador.atualizarJogador);
router.delete('/deletar/:id', autenticarToken, autenticaAdmin, controllerJogador.deletarJogador);
router.get('/filtrar', autenticarToken, controllerJogador.filtrarJogadores);
router.get('/estatisticas/:id', autenticarToken, controllerJogador.estatisticasJogador);
router.post('/comentarios/:id_jogador', autenticarToken, controllerJogador.registrarComentario);
router.get('/comentarios/:id_jogador', autenticarToken, controllerJogador.pegarComentarios);

module.exports = router;
