const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

exports.cadastrarOlheiro = (req, res) => {
    const db = req.app.get('db');
    const sql = 'INSERT INTO olheiros (0, nome, email, senha) VALUES (?, ?, ?)';
    const values = [
        req.body.nome,
        req.body.email,
        crypto.createHash('md5').update(req.body.senha).digest('hex')
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar olheiro:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar olheiro' });
        }
        res.status(201).json({ message: 'Olheiro cadastrado com sucesso', id: result.insertId });
    });
};

exports.login = (req, res) => {
    const db = req.app.get('db');

     const sql = "select * from usuarios where email_usuario = ? and senha_usuario = ?";

    const values = [
        req.body.email,
        crypto.createHash('md5').update(senha).digest('hex')
    ];

    db.query(sql, values, (err, result)=>{
        if(result.length > 0){
            const user = result[0]

            const payload = {
                id: user.id_usuario,
                admin: user.admin,
                nome: user.nome_usuario,
                email: user.email_usuario
            };

            const data = new Date();
            data.setHours(new Date().getHours() + 10);

            const token = jwt.sign(payload, key, {expiresIn: data.getTime()});

            res.status(201).json({token});
        } else {
            res.status(401).json({msg: 'Login FOI UMA MERDA'})
        }
    });
};