// controllers/controllerCampeonato.js
const Campeonato = require('../models/Campeonato');

exports.listarCampeonatos = async (req, res) => {
  try {
    const campeonatos = await Campeonato.findAll({
      order: [['data_inicio', 'ASC']]
    });
    
    // Formatação consistente das datas
    const campeonatosFormatados = campeonatos.map(c => ({
      id_campeonato: c.id_campeonato,
      nome_campeonato: c.nome_campeonato,
      data_inicio: c.data_inicio, // Mantém formato YYYY-MM-DD para compatibilidade
      data_fim: c.data_fim,       // O frontend fará a formatação de exibição
      local_campeonato: c.local_campeonato
    }));
    
    return res.status(200).json(campeonatosFormatados);
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

// DELETE /api/campeonato/deletar/:id
exports.deletarCampeonato = async (req, res) => {
  console.log('Rota de deletar campeonato chamada!');
  console.log('Parâmetros recebidos:', req.params);
  console.log('ID recebido:', req.params.id);

  try {
    const { id } = req.params;
    const Partida = require('../models/Partida'); // Importar aqui para evitar circular dependency
    
    console.log('Procurando campeonato com ID:', id);
    const campeonato = await Campeonato.findByPk(id);
    console.log('Campeonato encontrado:', campeonato ? 'Sim' : 'Não');
    
    if (!campeonato) {
      console.log('Campeonato não encontrado');
      return res.status(200).json({ ok: false, reason: 'not_found', msg: 'Campeonato não encontrado.' });
    }

    console.log('Verificando partidas associadas...');
    // Verificar se existem partidas associadas a este campeonato
    const partidasAssociadas = await Partida.findAll({
      where: { id_campeonato: id }
    });

    console.log('Partidas associadas encontradas:', partidasAssociadas.length);

    if (partidasAssociadas.length > 0) {
      console.log('Deletar cancelado - partidas associadas');
      return res.status(200).json({ 
        ok: false, 
        reason: 'foreign_key_constraint', 
        msg: `Não é possível deletar o campeonato pois existem ${partidasAssociadas.length} partida(s) associada(s). Delete as partidas primeiro.` 
      });
    }

    console.log('Deletando campeonato...');
    await campeonato.destroy();
    console.log('Campeonato deletado com sucesso!');
    return res.status(200).json({ ok: true, msg: 'Campeonato deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar campeonato:', err);
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';
    
    // Tratamento específico para erro de chave estrangeira
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(200).json({ 
        ok: false, 
        reason: 'foreign_key_constraint', 
        msg: 'Não é possível deletar o campeonato pois existem partidas associadas. Delete as partidas primeiro.' 
      });
    }
    
    return res.status(200).json({ ok: false, reason: code, msg: `Erro ao deletar campeonato (${code}): ${msg}` });
  }
};
