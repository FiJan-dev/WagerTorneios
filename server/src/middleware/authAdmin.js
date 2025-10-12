const autenticaAdmin = (req, res, next) => {
    if (req.user && req.user.admin !== 1) {
        return res.status(403).json({ msg: 'Acesso negado. Admins apenas.' });
    }
    next();
};

module.exports = autenticaAdmin;