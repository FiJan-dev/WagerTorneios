const express = require('express');
const router = express.Router();

const controllerJogador = require('../controllers/controllerJogador');
const autenticarToken = require('../middleware/authmiddlaware');
const autenticarTokenSoft = require('../middleware/authSoft');
const autenticaAdmin = require('../middleware/authAdmin');

router.post('/cadastrar', autenticarToken, autenticaAdmin, controllerJogador.cadastrarJogador);
router.get('/listar', autenticarTokenSoft, controllerJogador.listarJogadores);
router.put('/atualizar/:id', autenticarToken, autenticaAdmin, controllerJogador.atualizarJogador);
router.delete('/deletar/:id', autenticarToken, autenticaAdmin, controllerJogador.deletarJogador);
router.get('/estatisticas/:id', autenticarTokenSoft, controllerJogador.estatisticas);
router.get('/grafico/:id', autenticarTokenSoft, controllerJogador.EstatisticasGrafico);
router.post('/comentarios/:id_jogador', autenticarToken, controllerJogador.registrarComentario);
router.get('/comentarios/:id_jogador', autenticarTokenSoft, controllerJogador.pegarComentarios);
router.post('/shortlist/adicionar', autenticarToken, controllerJogador.adicionarShortlist);
router.get('/shortlist', autenticarToken, controllerJogador.listarShortlist);
router.delete('/shortlist/remover/:id', autenticarToken, controllerJogador.removerShortlist);

module.exports = router;