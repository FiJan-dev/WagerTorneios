const express = require('express');
const router = express.Router();
const controllerUsuario = require('../controllers/controllerUsuario.js');
const autenticarToken = require('../middleware/authmiddlaware.js');

router.post('/login', controllerUsuario.login);
router.post('/cadastrar', controllerUsuario.cadastrarOlheiro);
router.put('/recuperar-senha/:email', controllerUsuario.atualizarSenha);



module.exports = router;