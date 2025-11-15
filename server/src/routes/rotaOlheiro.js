const express = require('express');
const router = express.Router();
const controllerUsuario = require('../controllers/controllerUsuario.js');
const autenticarToken = require('../middleware/authmiddlaware.js');
const autenticaAdmin = require('../middleware/authAdmin.js');

router.post('/login', controllerUsuario.login);
router.post('/cadastrar', controllerUsuario.cadastrarOlheiro);
router.put('/recuperar-senha/:email', controllerUsuario.atualizarSenha);

// Rotas protegidas por admin
router.get('/listar', autenticarToken, autenticaAdmin, controllerUsuario.listarOlheiros);
router.put('/aprovar/:id', autenticarToken, autenticaAdmin, controllerUsuario.aprovarOlheiro);
router.put('/rejeitar/:id', autenticarToken, autenticaAdmin, controllerUsuario.rejeitarOlheiro);
router.delete('/excluir/:id', autenticarToken, autenticaAdmin, controllerUsuario.excluirOlheiro);

module.exports = router;