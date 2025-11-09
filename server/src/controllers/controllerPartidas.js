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
        // Cria campeonato com base na data da partida
        const dataPartidaObj = new Date(data_partida);
        const hoje = new Date();
        
        // Define início do campeonato
        const dataInicio = dataPartidaObj < hoje ? 
          hoje.toISOString().slice(0, 10) : 
          dataPartidaObj.toISOString().slice(0, 10);
        
        // Define fim do campeonato (3 meses após o início ou data da partida, o que for maior)
        const dataFimObj = new Date(dataInicio);
        dataFimObj.setMonth(dataFimObj.getMonth() + 3);
        
        const dataPartidaFim = new Date(data_partida);
        dataPartidaFim.setDate(dataPartidaFim.getDate() + 1); // Um dia após a partida
        
        const dataFim = dataPartidaFim > dataFimObj ? 
          dataPartidaFim.toISOString().slice(0, 10) : 
          dataFimObj.toISOString().slice(0, 10);

        campeonato = await Campeonato.create({
          nome_campeonato,
          data_inicio: dataInicio,
          data_fim: dataFim,
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

    // --- validação de data da partida dentro do período do campeonato ---
    const dataPartida = new Date(data_partida);
    const dataInicio = new Date(campeonato.data_inicio + 'T00:00:00');
    const dataFim = new Date(campeonato.data_fim + 'T23:59:59');
    
    if (dataPartida < dataInicio || dataPartida > dataFim) {
      const inicioFormatado = new Date(campeonato.data_inicio).toLocaleDateString('pt-BR');
      const fimFormatado = new Date(campeonato.data_fim).toLocaleDateString('pt-BR');
      return res.status(200).json({ 
        ok: false, 
        reason: 'validation', 
        msg: `A data da partida deve estar entre ${inicioFormatado} e ${fimFormatado} (período do campeonato "${campeonato.nome_campeonato}").` 
      });
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
      data_partida: p.data_partida ? p.data_partida.toISOString() : null,
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

// DELETE /api/partida/deletar/:id
exports.deletarPartida = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Tentando deletar partida com ID:', id);
    console.log('Usuário que está deletando:', req.user);
    
    if (!id || isNaN(id)) {
      console.log('ID inválido fornecido:', id);
      return res.status(400).json({ ok: false, reason: 'invalid_id', msg: 'ID da partida inválido.' });
    }
    
    const partida = await Partida.findByPk(id);
    console.log('Partida encontrada:', partida ? partida.toJSON() : null);
    
    if (!partida) {
      console.log('Partida não encontrada com ID:', id);
      return res.status(404).json({ ok: false, reason: 'not_found', msg: 'Partida não encontrada.' });
    }

    await partida.destroy();
    console.log('Partida deletada com sucesso, ID:', id);
    return res.status(200).json({ ok: true, msg: 'Partida deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar partida:', err);
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';
    return res.status(500).json({ ok: false, reason: code, msg: `Erro ao deletar partida (${code}): ${msg}` });
  }
};
