// controllers/controllerPartidas.js
const Campeonato = require('../models/Campeonato');
const Time = require('../models/Time');
const Partida = require('../models/Partida');

exports.registrarPartida = async (req, res) => {
  try {
    const {
      id_campeonato,           // opcional
      nome_campeonato,         // obrigatório se id_campeonato não vier
      time_casa,
      time_visitante,
      data_partida,            // "YYYY-MM-DD HH:mm:ss" ou ISO do datetime-local
      local_partida,
      placar_casa = 0,
      placar_visitante = 0,
    } = req.body;

    // validações mínimas
    if ((!id_campeonato && !nome_campeonato) ||
        !time_casa || !time_visitante || !data_partida || !local_partida) {
      return res.status(200).json({ ok: false, reason: 'validation', msg: 'Todos os campos são obrigatórios.' });
    }

    // --- campeonato ---
    let campeonato = null;

    if (id_campeonato) {
      campeonato = await Campeonato.findByPk(id_campeonato);
      if (!campeonato) {
        return res.status(200).json({ ok: false, reason: 'not_found', msg: 'Campeonato informado não existe.' });
      }
    }

    if (!campeonato) {
      // find-or-create por nome
      campeonato = await Campeonato.findOne({ where: { nome_campeonato } });
      if (!campeonato) {
        // ajusta datas para respeitar validações do model (data_inicio isAfter hoje)
        const dt = new Date(data_partida);
        const todayYMD = new Date().toISOString().slice(0, 10);
        const ymd = isNaN(dt.getTime()) ? todayYMD : dt.toISOString().slice(0, 10);
        const inicio = ymd > todayYMD ? ymd : todayYMD;
        const fim = inicio; // mantém igual; seu model exige fim > início? (se sim, use um dia após)

        // se seu model exigir data_fim > data_inicio estritamente, use:
        // const fim = new Date(inicio);
        // fim.setDate(fim.getDate() + 1);
        // const fimYMD = fim.toISOString().slice(0,10);

        campeonato = await Campeonato.create({
          nome_campeonato,
          data_inicio: inicio,
          data_fim: fim,
          local_campeonato: local_partida || 'A definir',
        });
      }
    }

    // --- times ---
    let timeCasa = await Time.findOne({ where: { nome_time: time_casa } });
    if (!timeCasa) {
      timeCasa = await Time.create({ nome_time: time_casa, cidade_time: 'A definir' });
    }

    let timeVisitante = await Time.findOne({ where: { nome_time: time_visitante } });
    if (!timeVisitante) {
      timeVisitante = await Time.create({ nome_time: time_visitante, cidade_time: 'A definir' });
    }

    if (timeCasa.id_time === timeVisitante.id_time) {
      return res.status(200).json({ ok: false, reason: 'validation', msg: 'Os times não podem ser iguais.' });
    }

    // --- partida ---
    const partida = await Partida.create({
      id_campeonato: campeonato.id_campeonato,
      id_time_casa: timeCasa.id_time,
      id_time_visitante: timeVisitante.id_time,
      data_partida,
      local_partida,
      placar_casa,
      placar_visitante,
    });

    return res.status(200).json({ ok: true, msg: 'Partida registrada com sucesso.', partida });
  } catch (err) {
    console.error('Erro ao registrar partida:', err);
    // Trata validações do Sequelize de forma amigável
    if (err.name === 'SequelizeValidationError') {
      return res.status(200).json({
        ok: false,
        reason: 'validation',
        msg: err.errors.map(e => e.message).join('; ')
      });
    }
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';
    return res.status(200).json({ ok: false, reason: code, msg: `Erro ao registrar partida (${code}): ${msg}` });
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
      nome_campeonato: p.Campeonato?.nome_campeonato || '',
      nome_time_casa: p.timeCasa?.nome_time || '',
      nome_time_visitante: p.timeVisitante?.nome_time || '',
    }));

    return res.status(200).json(formattedPartidas);
  } catch (err) {
    console.error('Erro ao listar partidas:', err);
    return res.status(200).json([]);
  }
};
