// middleware/authSoft.js
const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

/**
 * Autenticação "suave":
 * - Se não tiver token ou for inválido, responde 200 com msg simples e NÃO segue.
 * - Se ok, injeta req.user e segue.
 */
const autenticarTokenSoft = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    return res.status(200).json({
      ok: false,
      reason: 'unauthenticated',
      msg: 'Faça login para continuar.'
    });
  }

  jwt.verify(token, key, (err, user) => {
    if (err) {
      return res.status(200).json({
        ok: false,
        reason: 'invalid_token',
        msg: 'Sessão expirada ou inválida. Faça login novamente.'
      });
    }
    req.user = user; // ex.: { id, email, role:'admin'|'olheiro' } ou { admin:1 }
    next();
  });
};

/**
 * Autorização "suave" somente admin:
 * - Se não for admin, responde 200 com "Acesso não permitido." e NÃO segue.
 */
const autenticaAdminSoft = (req, res, next) => {
  if (!req.user) {
    return res.status(200).json({
      ok: false,
      reason: 'unauthenticated',
      msg: 'Faça login para continuar.'
    });
  }

  const isAdminByRole =
    req.user.role && String(req.user.role).toLowerCase() === 'admin';
  const isAdminByFlag = Number(req.user.admin) === 1;

  if (!isAdminByRole && !isAdminByFlag) {
    return res.status(200).json({
      ok: false,
      reason: 'not_admin',
      msg: 'Acesso não permitido.'
    });
  }

  next();
};

module.exports = { autenticarTokenSoft, autenticaAdminSoft };
