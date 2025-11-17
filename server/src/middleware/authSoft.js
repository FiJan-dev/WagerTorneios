const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

/**
 * Middleware de autenticação "soft" - permite acesso sem token
 * mas valida e adiciona req.user se o token for fornecido
 */
const autenticarTokenSoft = (req, res, next) => {
  console.log('MIDDLEWARE AUTHSOFT CHAMADO');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Authorization Header:', authHeader);
  console.log('Token:', token);

  // Se não houver token, permite acesso sem autenticação
  if (!token) {
    console.log('Sem token - permitindo acesso público');
    req.user = null;
    return next();
  }

  // Se houver token, valida
  jwt.verify(token, key, (err, user) => {
    if (err) {
      console.log('Token inválido:', err.message);
      // Mesmo com token inválido, permite acesso (modo soft)
      req.user = null;
      return next();
    }

    console.log('Token válido - usuário autenticado:', user);
    req.user = user;
    next();
  });
};

module.exports = autenticarTokenSoft;
