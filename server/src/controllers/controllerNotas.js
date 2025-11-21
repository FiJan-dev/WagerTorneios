const { Notas, Jogador, Olheiro, Sequelize } = require('../models');
const { Op } = Sequelize;

// POST /api/notas
exports.avaliarJogador = async (req, res) => {
    try {
        const { id_jogador, nota } = req.body;
        const id_olheiro = req.user.id;

        if (!id_jogador || nota === undefined) {
            return res.status(200).json({
                ok: false,
                reason: 'validation',
                msg: 'ID do jogador e nota são obrigatórios.'
            });
        }

        if (nota < 1 || nota > 5) {
            return res.status(200).json({
                ok: false,
                reason: 'validation',
                msg: 'A nota deve ser um número entre 1 e 5.'
            });
        }

        const jogador = await Jogador.findByPk(id_jogador);
        if (!jogador){
            return res.status(200).json({
                ok: false,
                reason: 'not_found',
                msg: 'Jogador não encontrado.'
            });
        }

        const [avaliacao, created] = await Notas.upsert(
            {
                id_olheiro,
                id_jogador,
                nota: parseInt(nota)
            },
            { returning: true }
        );

        const stats = await Notas.findOne({
            where: { id_jogador },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('nota')), 'media'],
                [Sequelize.fn('COUNT', Sequelize.col('id_nota')), 'total']
            ],
            raw: true
        });

        const media = stats && stats.media ? parseFloat(stats.media).toFixed(2) : '0.00';
        const total = stats ? parseInt(stats.total) : 0;

        return res.status(created ? 2001 : 200).json({
            ok: true,
            msg: created ? 'Nota enviada com sucesso!' : 'Sua nota foi atualizada!',
            avaliacao: {
                id_jogador,
                sua_nota: parseInt(nota)
            },
            estatisticas: {
                media_nota: media,
                total_avaliacoes: total
            }
        });
    } catch (err) {
        console.error('Erro ao salvar nota: ', err);
        return res.status(200).json({
            ok: false,
            reason: err.name || 'ERROR',
            msg: 'Erro interno ao salvar nota.'
        });
    }
};

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

        const media = stats && stats.media ? parseFloat(stats.media).toFixed(2) : '0.00';
        const total = stats ? parseInt(stats.total) : 0;

        return res.status(200).json({
            ok: true,
            id_jogador: parseInt(id),
            media_nota: media,
            total_avaliacoes: total
        });
    } catch (err) {
        console.error('Erro ao calcular média:', err);
        return res.status(200).json({
            ok: false,
            reason: 'ERROR',
            msg: 'Erro ao calcular média de notas.'
        });
    }
};

exports.minhasNotas = async (req, res) => {
    try {
    const id_olheiro = req.user.id;

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
    });

    const formatted = notas.map(n => ({
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
    return res.status(200).json({
      ok: false,
      reason: 'ERROR',
      msg: 'Erro ao carregar suas notas.'
    });
  }
};