// controllers/controllerJogador.js
const { Jogador, Time, Estatisticas, Comentarios, Shortlist, Usuario } = require('../models/index');
const { Op } = require('sequelize');

const POSICOES = { 1: 'GOL', 2: 'LAT', 3: 'ZAG', 4: 'MEI', 5: 'ATA', 6: 'TEC' };

// POST /api/jogador/cadastrar
exports.cadastrarJogador = async (req, res) => {
   try {
    let {
      nome_jogador, posicao_jogador, nome_time, idade, altura_cm, peso_kg,
      passes_certos = 0, gols_marcados = 0, assistencias = 0,
      cartoes_amarelos = 0, cartoes_vermelhos = 0, finalizacoes = 0,
      roubadas_bola = 0, aceleracao = 0, chute_forca = 0,
      passe_total = 0, drible = 0
    } = req.body;

    if (!nome_jogador || !posicao_jogador || !nome_time) {
       return res.status(200).json({ ok: false, reason: 'validation', msg: 'Nome, posição e time são obrigatórios.' });
     }

     // Converte número para string de posição
     posicao_jogador = POSICOES[parseInt(posicao_jogador)] || posicao_jogador;

     let time = await Time.findOne({ where: { nome_time } });
     if (!time) time = await Time.create({ nome_time, cidade_time: 'A definir' });

     const jogador = await Jogador.create({
      nome_jogador, posicao_jogador, id_time: time.id_time,
      idade, altura_cm, peso_kg
    });

    await Estatisticas.create({
      id_jogador: jogador.id_jogador,
      passes_certos, gols_marcados, assistencias,
      cartoes_amarelos, cartoes_vermelhos, finalizacoes,
      roubadas_bola, aceleracao, chute_forca,
      passe_total, drible
    });

    return res.status(200).json({ ok: true, msg: 'Jogador cadastrado.', jogador });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    return res.status(200).json({ ok: false, reason: error.name || 'ERROR', msg: error.message });
  }
};

// GET /api/jogador/listar
exports.listarJogadores = async (req, res) => {
  try {
    const { posicao, idadeMin, idadeMax, alturaMin, alturaMax, pesoMin, pesoMax, nome, time } = req.query;

    // Construir filtros dinâmicos
    const whereClause = {};

    if (posicao) {
      whereClause.posicao_jogador = posicao;
    }

    if (idadeMin || idadeMax) {
      whereClause.idade = {};
      if (idadeMin) whereClause.idade[Op.gte] = parseInt(idadeMin);
      if (idadeMax) whereClause.idade[Op.lte] = parseInt(idadeMax);
    }

    if (alturaMin || alturaMax) {
      whereClause.altura_cm = {};
      if (alturaMin) whereClause.altura_cm[Op.gte] = parseInt(alturaMin);
      if (alturaMax) whereClause.altura_cm[Op.lte] = parseInt(alturaMax);
   }

   if (pesoMin || pesoMax) {
    whereClause.peso_kg = {};
    if (pesoMin) whereClause.peso_kg[Op.gte] = parseInt(pesoMin);
    if (pesoMax) whereClause.peso_kg[Op.lte] = parseInt(pesoMax);
    }


    if (nome) {
      whereClause.nome_jogador = { [Op.like]: `%${nome}%` };
    }

  
    const includeClause = [
      { 
       model: Time, 
       attributes: ['nome_time'],
       ...(time && { where: { nome_time: { [Op.like]: `%${time}%` } } })
      },
      { 
        model: Estatisticas, 
        attributes: Object.keys(Estatisticas.rawAttributes).filter(k => k !== 'id_estatistica' && k !== 'id_jogador'), 
        required: false 
      }
    ];

    const jogadores = await Jogador.findAll({
      attributes: ['id_jogador', 'nome_jogador', 'posicao_jogador', 'id_time', 'idade', 'altura_cm', 'peso_kg'],
      where: whereClause,
      include: includeClause,
      order: [['nome_jogador', 'ASC']]
    });

    const formatted = jogadores.map(j => ({
      id_jogador: j.id_jogador,
      nome_jogador: j.nome_jogador,
      posicao_jogador: j.posicao_jogador,
      nome_time: j.Time?.nome_time || 'Sem time',
      idade: j.idade,
      altura_cm: j.altura_cm,
      peso_kg: j.peso_kg,
      ...Object.fromEntries(
        Object.keys(Estatisticas.rawAttributes)
        .filter(k => !['id_estatistica', 'id_jogador'].includes(k))
        .map(k => [k, j.Estatistica?.[k] ?? 0])
      )
    }));

    return res.status(200).json(formatted);
   } catch (error) {
    console.error('Erro ao listar:', error);
    return res.status(200).json([]);
  }
};

// PUT /api/jogador/atualizar/:id
exports.atualizarJogador = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const jogador = await Jogador.findByPk(id);
    if (!jogador) return res.status(200).json({ ok: false, reason: 'not_found', msg: 'Jogador não encontrado.' });

    if (updates.posicao_jogador) {
      updates.posicao_jogador = POSICOES[parseInt(updates.posicao_jogador)] || updates.posicao_jogador;
    }

    if (updates.nome_time) {
      let time = await Time.findOne({ where: { nome_time: updates.nome_time } });
      if (!time) time = await Time.create({ nome_time: updates.nome_time, cidade_time: 'A definir' });
      updates.id_time = time.id_time;
  }

  await jogador.update({
    nome_jogador: updates.nome_jogador ?? jogador.nome_jogador,
    posicao_jogador: updates.posicao_jogador ?? jogador.posicao_jogador,
    id_time: updates.id_time ?? jogador.id_time,
    idade: updates.idade ?? jogador.idade,
    altura_cm: updates.altura_cm ?? jogador.altura_cm,
    peso_kg: updates.peso_kg ?? jogador.peso_kg,
    });

    const stats = await Estatisticas.findOne({ where: { id_jogador: id } }) || await Estatisticas.create({ id_jogador: id });
    const statsUpdates = {};
    const statsKeys = ['passes_certos', 'gols_marcados', 'assistencias', 'cartoes_amarelos', 'cartoes_vermelhos',
                       'finalizacoes', 'roubadas_bola', 'aceleracao', 'chute_forca', 'passe_total', 'drible'];
     statsKeys.forEach(k => {
      if (updates[k] !== undefined) statsUpdates[k] = updates[k];
      else statsUpdates[k] = stats[k];
    });
     await stats.update(statsUpdates);

     return res.status(200).json({ ok: true, msg: 'Jogador atualizado.' });
    } catch (error) {
       console.error('Erro ao atualizar:', error);
       return res.status(200).json({ ok: false, reason: error.name || 'ERROR', msg: error.message });
    }
};

// DELETE /api/jogador/deletar/:id
exports.deletarJogador = async (req, res) => {
  try {
    const { id } = req.params;
    const jogador = await Jogador.findByPk(id);
    if (!jogador) return res.status(200).json({ ok: false, reason: 'not_found', msg: 'Jogador não encontrado.' });

    await Estatisticas.destroy({ where: { id_jogador: id } });
    await Comentarios.destroy({ where: { id_jogador: id } });
    await Shortlist.destroy({ where: { id_jogador: id } }); // Adicionado para remover da Shortlist
    await jogador.destroy();

    return res.status(200).json({ ok: true, msg: 'Jogador deletado.' });
  } catch (err) {
    console.error('Erro ao deletar:', err);
    return res.status(200).json({ ok: false, reason: err.name || 'ERROR', msg: err.message });
  }
};

// POST /api/jogador/comentario/:id
exports.registrarComentario = async (req, res) => {
  try {
    const { id_jogador } = req.params;
    const { comentario } = req.body;
    const c = await Comentarios.create({ id_jogador, comentario });
    return res.status(200).json({ ok: true, msg: 'Comentário registrado.', comentario: c });
  } catch (err) {
    return res.status(200).json({ ok: false, reason: err.name || 'ERROR', msg: err.message });
  }
};

// GET /api/jogador/comentarios/:id
exports.pegarComentarios = async (req, res) => {
  try {
    const { id_jogador } = req.params;
    const comentarios = await Comentarios.findAll({ where: { id_jogador } });
    return res.status(200).json({ ok: true, comentarios });
  } catch (err) {
    return res.status(200).json({ ok: false, reason: err.name || 'ERROR', msg: err.message });
  }
};

// GET /api/jogador/estatisticas/:id
exports.estatisticas = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await Estatisticas.findOne({ where: { id_jogador: id } });
    if (!stats) return res.status(200).json({ ok: false, reason: 'not_found', msg: 'Estatísticas não encontradas.' });

    const media_finalizacoes = stats.finalizacoes > 0 ? (stats.gols_marcados / stats.finalizacoes).toFixed(2) : 0;

    return res.status(200).json({ ok: true, estatisticas: {
      passes_certos: stats.passes_certos,
      gols_marcados: stats.gols_marcados,
      assistencias: stats.assistencias,
      cartoes_amarelos: stats.cartoes_amarelos,
      cartoes_vermelhos: stats.cartoes_vermelhos,
      finalizacoes: stats.finalizacoes,
      media_finalizacoes: parseFloat(media_finalizacoes),
      roubadas_bola: stats.roubadas_bola,
      aceleracao: stats.aceleracao,
      chute_forca: stats.chute_forca,
      passe_total: stats.passe_total,
      drible: stats.drible,
    }});
  } catch (err) {
    return res.status(200).json({ ok: false, reason: 'ERROR', msg: err.message });
  }
};

// GET /api/jogador/grafico/:id/hexagono
exports.EstatisticasGrafico = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await Estatisticas.findOne({
      where: { id_jogador: id },      
      include: [{ model: Jogador, attributes: ['nome_jogador'], include: [{ model: Time, attributes: ['nome_time'] }] }]
    });

    if (!stats) return res.status(200).json({ ok: false, msg: 'Jogador não encontrado' });

    const normalizar = (valor, max) => Math.min(100, (valor / max) * 100);

    const data = {
      nome: stats.Jogador.nome_jogador,
      labels: ['Físico', 'Velocidade', 'Chute', 'Passe', 'Drible', 'Finalização'],
      valores: [
        normalizar(stats.roubadas_bola, 50),
        normalizar(stats.aceleracao, 30),
        normalizar(stats.chute_forca, 40),
        normalizar(stats.passe_total, 800),
        normalizar(stats.drible, 60),
        normalizar(stats.finalizacoes, 100)
      ],
      rawStats: {
        passes_certos: stats.passes_certos,
        finalizacoes: stats.finalizacoes,
        gols_marcados: stats.gols_marcados,
        assistencias: stats.assistencias,
        cartoes_amarelos: stats.cartoes_amarelos,
        cartoes_vermelhos: stats.cartoes_vermelhos,
        roubadas_bola: stats.roubadas_bola,
        aceleracao: stats.aceleracao,
        chute_forca: stats.chute_forca,
        passe_total: stats.passe_total,
        drible: stats.drible,
      }
    };

    res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.status(200).json({ ok: false, msg: 'Erro interno' });
  }
};

// POST /api/jogador/shortlist/adicionar
exports.adicionarShortlist = async (req, res) => {
   try {
    const { id_jogador } = req.body;
    // CRUCIAL: Pega o ID do usuário do token (middleware autenticarToken)
    // Usamos 'req.user' ou 'req.usuario' dependendo da sua autenticação.
    const id_usuario = req.user?.id 

    if (!id_jogador) {
      return res.status(400).json({ ok: false, reason: 'validation', msg: 'ID do jogador é obrigatório.' }); // Alterado para 400
   }
   if (!id_usuario) {
      console.log(req.user);
       return res.status(401).json({ ok: false, msg: 'Usuário não autenticado.' }); // Adicionado para segurança
   }

    const jogador = await Jogador.findByPk(id_jogador);
     if (!jogador) {
       return res.status(404).json({ ok: false, reason: 'not_found', msg: 'Jogador não encontrado.' }); // Alterado para 404
     }

    // Verifica se já existe na shortlist PESSOAL
     const existe = await Shortlist.findOne({ 
        where: { id_jogador: id_jogador, id_usuario: id_usuario } 
    });

     if (existe) {
     return res.status(409).json({ ok: false, msg: 'Jogador já está na sua shortlist.' }); // Alterado para 409
     }

    // Cria a entrada na shortlist com o id_usuario
    await Shortlist.create({ id_jogador, id_usuario });

     return res.status(201).json({ ok: true, msg: 'Jogador adicionado à shortlist.' }); // Alterado para 201
     } catch (err) {
      console.error('Erro ao adicionar à shortlist:', err);
       return res.status(500).json({ ok: false, reason: err.name || 'ERROR', msg: err.message }); // Alterado para 500
   }
};

// GET /api/jogador/shortlist
exports.listarShortlist = async (req, res) => {
    // CRUCIAL: Pega o ID do usuário do token (middleware autenticarToken)
    // Usamos 'req.user' ou 'req.usuario' dependendo da sua autenticação.
    const id_usuario = req.user?.id 
    
    if (!id_usuario) {
       return res.status(401).json({ ok: false, msg: 'Usuário não autenticado.' });
    }
    
    try {
      const jogadores = await Shortlist.findAll({
            // FILTRA APENAS PELA LISTA DO USUÁRIO LOGADO
            where: { id_usuario: id_usuario },
            include: [
              {
                model: Jogador,
                attributes: ['id_jogador', 'nome_jogador', 'posicao_jogador', 'id_time', 'idade', 'altura_cm', 'peso_kg'],
                // Assumindo que você tem associação com Time no modelo Jogador
                include: [{ model: Time, attributes: ['nome_time'] }]
              }
            ]
          });


      const formatted = jogadores.map(j => ({
        id_jogador: j.Jogador.id_jogador,
        nome_jogador: j.Jogador.nome_jogador,
        posicao_jogador: j.Jogador.posicao_jogador,
        nome_time: j.Jogador.Time?.nome_time || 'Sem time',
        idade: j.Jogador.idade,
        altura_cm: j.Jogador.altura_cm,
        peso_kg: j.Jogador.peso_kg
        }));
        
        // CORREÇÃO CRÍTICA: Enviar a resposta para o frontend
        return res.status(200).json({ ok: true, jogadores: formatted }); 

      } catch (err) {
        console.error('Erro ao listar shortlist:', err);
        // O frontend espera { ok: false } se o status for 500
        return res.status(500).json({ ok: false, reason: err.name || 'ERROR', msg: 'Erro interno ao listar shortlist.' });
    }
};

// DELETE /api/jogador/shortlist/remover/:id
exports.removerShortlist = async (req, res) => {
  try {
    const { id } = req.params; // id é o id_jogador
        // CRUCIAL: Pega o ID do usuário do token (middleware autenticarToken)
        const id_usuario = req.user?.id 

        if (!id_usuario) {
            return res.status(401).json({ ok: false, msg: 'Usuário não autenticado.' });
        }
        
        const resultado = await Shortlist.destroy({ 
            where: { 
                id_jogador: id, 
                id_usuario: id_usuario // GARANTE QUE REMOVE APENAS DA LISTA DESTE USUÁRIO
            } 
        });

        if (resultado > 0) {
          return res.status(200).json({ ok: true, msg: 'Jogador removido da shortlist.' });
        } else {
            return res.status(404).json({ ok: false, reason: 'not_found', msg: 'Jogador não está na sua shortlist.' }); // Alterado para 404
          }
        } catch (err) {
          console.error('Erro ao remover da shortlist:', err);
          return res.status(500).json({ ok: false, reason: err.name || 'ERROR', msg: 'Erro interno ao remover da shortlist.' });
        }
};

// POST /api/jogador/comparar
exports.compararJogadores = async (req, res) => {
  try {
    const { playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length < 2 || playerIds.length > 3) {
      return res.status(200).json({ 
        ok: false, 
        reason: 'validation', 
        msg: 'Você deve selecionar entre 2 e 3 jogadores para comparar.' 
      });
    }

    const jogadores = await Jogador.findAll({
      where: { id_jogador: playerIds },
      include: [
        { 
          model: Time, 
          attributes: ['nome_time'] 
        },
        { 
          model: Estatisticas, 
          attributes: Object.keys(Estatisticas.rawAttributes).filter(k => k !== 'id_estatistica' && k !== 'id_jogador'), 
          required: false 
        }
      ]
    });

    if (jogadores.length !== playerIds.length) {
      return res.status(200).json({ 
        ok: false, 
        reason: 'not_found', 
        msg: 'Um ou mais jogadores não foram encontrados.' 
      });
    }

    const formatted = jogadores.map(j => ({
      id_jogador: j.id_jogador,
      nome_jogador: j.nome_jogador,
      posicao_jogador: j.posicao_jogador,
      idade: j.idade,
      altura_cm: j.altura_cm,
      peso_kg: j.peso_kg,
      Time: j.Time,
      Estatistica: j.Estatistica
    }));

    return res.status(200).json({ ok: true, jogadores: formatted });
  } catch (err) {
    console.error('Erro ao comparar jogadores:', err);
    return res.status(500).json({ 
      ok: false, 
      reason: err.name || 'ERROR', 
      msg: 'Erro interno ao comparar jogadores.' 
    });
  }
};
