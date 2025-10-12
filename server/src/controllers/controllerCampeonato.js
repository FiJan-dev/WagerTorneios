// controllers/controllerCampeonato.js
const Campeonato = require('../models/Campeonato');

exports.listarCampeonatos = async (req, res) => {
  try {
    const campeonatos = await Campeonato.findAll();
    // >>> Front espera ARRAY puro
    return res.status(200).json(campeonatos);
  } catch (err) {
    console.error('Erro ao listar campeonatos:', err);
    // >>> Para não quebrar a tabela no front, devolve []
    return res.status(200).json([]);
  }
};

exports.criarCampeonatos = async (req, res) => {
  try {
    const { nome_campeonato, data_inicio, data_fim, local_campeonato } = req.body;

    if (!nome_campeonato || !data_inicio || !data_fim || !local_campeonato) {
      return res.status(200).json({
        ok: false,
        reason: 'validation',
        msg: 'Preencha todos os campos obrigatórios.'
      });
    }

    const campeonato = await Campeonato.create({
      nome_campeonato,
      data_inicio,
      data_fim,
      local_campeonato
    });

    return res.status(200).json({
      ok: true,
      msg: 'Campeonato criado com sucesso.',
      campeonato
    });
  } catch (err) {
    console.error('Erro ao criar campeonato:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(200).json({
        ok: false,
        reason: 'validation',
        msg: err.errors.map(e => e.message).join('; ')
      });
    }
    return res.status(200).json({ ok: false, msg: 'Não foi possível criar agora.' });
  }
};
