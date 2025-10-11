const Campeonato = require('../models/Campeonato');
const Time = require('../models/Time');
const Partida = require('../models/Partida');

// Cadastra a partida criando campeonato e times automaticamente se não existirem.
exports.registrarPartida = async (req, res) => {
  try {
    const {
      nome_campeonato,    // ex.: "Copa X"
      time_casa,          // ex.: "Time A"
      time_visitante,     // ex.: "Time B"
      data_partida,       // "YYYY-MM-DD HH:mm:ss"
      local_partida,      // ex.: "Arena Central"
      placar_casa = 0,
      placar_visitante = 0,
    } = req.body;

    // validações mínimas
    if (!nome_campeonato || !time_casa || !time_visitante || !data_partida || !local_partida) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }


    // helpers: find-or-create
    let campeonato = await Campeonato.findOne({ where: { nome_campeonato } });
    if (!campeonato) {
      const dataISO = new Date(data_partida).toISOString().slice(0, 10);
      campeonato = await Campeonato.create({
        nome_campeonato,
        data_inicio: dataISO,
        data_fim: dataISO,
        local_campeonato: local_partida || 'A definir',
      });
    }

    let timeCasa = await Time.findOne({ where: { nome_time: time_casa } });
    if (!timeCasa) {
      timeCasa = await Time.create({ nome_time: time_casa, cidade_time: 'A definir' });
    }

    let timeVisitante = await Time.findOne({ where: { nome_time: time_visitante } });
    if (!timeVisitante) {
      timeVisitante = await Time.create({ nome_time: time_visitante, cidade_time: 'A definir' });
    }

    if (timeCasa.id_time === timeVisitante.id_time) {
      return res.status(400).json({ error: "Os times não podem ser iguais." });
    }

    const partida = await Partida.create({
      id_campeonato: campeonato.id_campeonato,
      id_time_casa: timeCasa.id_time,
      id_time_visitante: timeVisitante.id_time,
      data_partida,
      local_partida,
      placar_casa,
      placar_visitante,
    });

    return res.status(201).json({ message: "Partida registrada com sucesso.", partida });
  } catch (err) {
    console.error("Erro ao registrar partida:", err);
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';

    return res.status(500).json({ error: 'Erro ao registrar partida (${code}): ${msg}' });
  }
};

exports.listarPartidas = async (_req, res) => {
  try {
    const partidas = await Partida.findAll({
      include: [
        { model: Campeonato, attributes: ['nome_campeonato'] },
        { model: Time, as: 'timeCasa', attributes: ['nome_time'] },
        { model: Time, as: 'timeVisitante', attributes: ['nome_time'] },
      ],
      order: [['data_partida', 'ASC']],
    });
    
    const formattedPartidas = partidas.map(p => ({
      id_partida: p.id_partida,
      data_partida: p.data_partida,
      local_partida: p.local_partida,
      placar_casa: p.placar_casa,
      placar_visitante: p.placar_visitante,
      nome_campeonato: p.Campeonato.nome_campeonato,
      nome_time_casa: p.timeCasa.nome_time,
      nome_time_visitante: p.timeVisitante.nome_time,
    }));
    return res.status(200).json(formattedPartidas);
  } catch (err) {
    console.error("Erro ao listar partidas:", err);
    return res.status(500).json({ error: 'Erro ao listar partidas.' });
  }
};
