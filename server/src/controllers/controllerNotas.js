const { Notas, Jogador, Olheiro } = require('../models');
const Sequelize = require('sequelize');

// POST /api/notas
exports.avaliarJogador = async (req, res) => {
    try {
        const { id_jogador, nota } = req.body;
        // Assume que o id do olheiro é definido pelo middleware de autenticação
        // O JWT pode ter: id, id_usuario ou id_olheiro
        const id_olheiro = req.user?.id_usuario || req.user?.id || req.user?.id_olheiro;

        // debug logs removed

        if (!id_olheiro) {
            return res.status(401).json({
                ok: false,
                reason: 'unauthorized',
                msg: 'Usuário não autenticado. ID do olheiro não encontrado.'
            });
        }

        if (!id_jogador || nota === undefined) {
            // 🚨 CORRIGIDO: Status 400 (Bad Request)
            return res.status(400).json({
                ok: false,
                reason: 'validation',
                msg: 'ID do jogador e nota são obrigatórios.'
            });
        }

        if (nota < 1 || nota > 5) {
            // 🚨 CORRIGIDO: Status 400 (Bad Request)
            return res.status(400).json({
                ok: false,
                reason: 'validation',
                msg: 'A nota deve ser um número entre 1 e 5.'
            });
        }

        const jogador = await Jogador.findByPk(id_jogador);
        if (!jogador){
            // 🚨 CORRIGIDO: Status 404 (Not Found)
            return res.status(404).json({
                ok: false,
                reason: 'not_found',
                msg: 'Jogador não encontrado.'
            });
        }

        // Se o registro não existe, ele é criado (INSERT). Se existe, ele é atualizado (UPDATE).
        // Funciona graças ao índice único composto no modelo Notas.js
        const [avaliacao, created] = await Notas.upsert(
            {
                id_olheiro,
                id_jogador,
                nota: parseInt(nota),
            },
            { 
                returning: true, 
                where: { id_olheiro, id_jogador } 
            }
        );

        // Recalcular estatísticas
        const stats = await Notas.findOne({
            where: { id_jogador },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('nota')), 'media'],
                [Sequelize.fn('COUNT', Sequelize.col('id_nota')), 'total']
            ],
            raw: true
        });

        // 🟢 MELHORIA: Retorna a média como float (número)
        const media = stats && stats.media ? parseFloat(stats.media) : 0.0; 
        const total = stats ? parseInt(stats.total) : 0;

        return res.status(created ? 201 : 200).json({ // 201 para criado, 200 para atualizado
            ok: true,
            msg: created ? '✅ Nota enviada com sucesso!' : '✅ Sua nota foi atualizada!',
            avaliacao: {
                id_jogador,
                sua_nota: parseInt(nota)
            },
            estatisticas: { 
                media_nota: media, // Retorna como float
                total_avaliacoes: total
            }
        });
    } catch (err) {
        console.error('Erro ao salvar nota: ', err);
        // 🚨 CORRIGIDO: Status 500 (Internal Server Error)
        return res.status(500).json({ 
            ok: false,
            reason: err.name || 'INTERNAL_ERROR',
            msg: 'Erro interno ao salvar nota.'
        });
    }
};

// GET /api/notas/media/:id
exports.getMediaJogador = async (req, res) => {
    try {
        const { id } = req.params;

        const stats = await Notas.findOne({
            where: { id_jogador: id },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('nota')), 'media'],
                [Sequelize.fn('COUNT', Sequelize.col('id_nota')), 'total']
            ],
            raw: true
        });

        // 🟢 MELHORIA: Retorna a média como float (número)
        const media = stats && stats.media ? parseFloat(stats.media) : 0.0; 
        const total = stats ? parseInt(stats.total) : 0;

        return res.status(200).json({
            ok: true,
            id_jogador: parseInt(id),
            estatisticas: {
                media_nota: media, // Retorna como float
                total_avaliacoes: total
            }
        });
    } catch (err) {
        console.error('Erro ao calcular média:', err);
        // 🚨 CORRIGIDO: Status 500 (Internal Server Error)
        return res.status(500).json({ 
            ok: false,
            reason: 'ERROR',
            msg: 'Erro ao calcular média de notas.'
        });
    }
};

// GET /api/notas/minhas
exports.minhasNotas = async (req, res) => {
    try {
    const id_olheiro = req.user?.id_usuario || req.user?.id || req.user?.id_olheiro;

    if (!id_olheiro) {
      return res.status(401).json({
        ok: false,
        reason: 'unauthorized',
        msg: 'Usuário não autenticado.'
      });
    }

    const notas = await Notas.findAll({
      where: { id_olheiro },
      include: [
        {
          model: Jogador,
          attributes: ['id_jogador', 'nome_jogador', 'posicao_jogador'],
          include: [{ model: require('../models/Time'), attributes: ['nome_time'] }]
        }
      ],
      order: [['id_nota', 'DESC']]
    });    const formatted = notas.map(n => ({
      id_jogador: n.Jogador.id_jogador,
      nome_jogador: n.Jogador.nome_jogador,
      posicao_jogador: n.Jogador.posicao_jogador,
      nome_time: n.Jogador.Time?.nome_time || 'Sem time',
      sua_nota: n.nota
    }));

    return res.status(200).json({
      ok: true,
      total: formatted.length,
      notas: formatted
    });

  } catch (err) {
    console.error('Erro ao listar minhas notas:', err);
    return res.status(500).json({ 
      ok: false,
      reason: 'ERROR',
      msg: 'Erro ao carregar suas notas.'
    });
  }
};