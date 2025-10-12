// routes/rotaJogador.js
const express = require('express');
const router = express.Router();

const controllerJogador = require('../controllers/controllerJogador');
const { autenticarTokenSoft, autenticaAdminSoft } = require('../middleware/authSoft');

// Rotas Jogador (modo suave)
router.post('/cadastrar', autenticarTokenSoft, autenticaAdminSoft, controllerJogador.cadastrarJogador);
router.get('/listar', autenticarTokenSoft, controllerJogador.listarJogadores);
router.put('/atualizar/:id', autenticarTokenSoft, autenticaAdminSoft, controllerJogador.atualizarJogador);
router.delete('/deletar/:id', autenticarTokenSoft, autenticaAdminSoft, controllerJogador.deletarJogador);

module.exports = router;
