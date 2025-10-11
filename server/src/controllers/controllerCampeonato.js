const Campeonato = require('../models/Campeonato');
const key = process.env.SECRET_KEY;

exports.listarCampeonatos = async (req, res) => {
    try {
        const campeonatos = await Campeonato.findAll();
        res.status(200).json(campeonatos);
    } catch (err) {
        console.error('Erro ao listar campeonatos:', err);
        res.status(500).json({ error: 'Erro ao listar campeonatos' });
    }
};

exports.criarCampeonatos = async (req, res) => {
    try {
        const { nome_campeonato, data_inicio, data_fim, local_campeonato } = req.body;

        const campeonato = await Campeonato.create({
            nome_campeonato,
            data_inicio,
            data_fim,
            local_campeonato
        });
        return res.status(201).json({ message: 'Campeonato criado com sucesso', campeonato });
    } catch (err) {
        console.error('Erro ao criar campeonato:', err);
        return res.status(500).json({ error: 'Erro ao criar campeonato' });
    }
};