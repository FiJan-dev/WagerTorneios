const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

exports.listarCampeonatos = (req, res) => {
    const db = req.app.get('db');
    const sql = 'SELECT * FROM campeonatos';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao listar campeonatos:', err);
            return res.status(500).json({ error: 'Erro ao listar campeonatos' });
        }
        res.status(200).json(results);
    });
};

exports.criarCampeonatos = (req, res) => {
    const db = req.app.get('db');
    const sql = 'INSERT INTO campeonatos (nome_campeonato, data_inicio, data_fim, local_campeonato) VALUES (?, ?, ?, ?)';
    const values = [
        req.body.nome_campeonato,
        req.body.data_inicio,
        req.body.data_fim,
        req.body.local_campeonato
    ];

    if (new Date(req.body.data_inicio) >= new Date(req.body.data_fim)) {
        return res.status(400).json({ error: 'A data de início deve ser anterior à data de fim' });   
    };

    if (new Date(req.body.data_inicio) < new Date()) {
        return res.status(400).json({ error: 'A data de início não pode ser no passado' });
    };

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao criar campeonato:', err);
            return res.status(500).json({ error: 'Erro ao criar campeonato' });
        }
        res.status(201).json({ message: 'Campeonato criado com sucesso', id: result.insertId });
    });
};