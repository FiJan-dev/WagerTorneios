// controllers/controllerJogador.js
const { Jogador, Time } = require('../models/index');
const { Op } = require('sequelize');

// POST /api/jogador/cadastrar
exports.cadastrarJogador = async (req, res) => {
  try {
    const {
      nome_jogador,
      posicao_jogador,
      nome_time,
      altura_cm,
      peso_kg,
      idade,
      passes_certos = 0,
      gols_marcados = 0,
      assistencias = 0,
      cartoes_amarelos = 0,
      cartoes_vermelhos = 0,
      finalizacoes = 0,
    } = req.body;

    // Validação mínima (suave)
    if (!nome_jogador || !posicao_jogador || !nome_time) {
      return res.status(200).json({
        ok: false,
        reason: 'validation',
        msg: 'Nome do jogador, posição e nome do time são obrigatórios.'
      });
    }

    // Busca ou cria time
    let time = await Time.findOne({ where: { nome_time } });
    if (!time) {
      time = await Time.create({ nome_time, cidade_time: 'A definir' });
    }

    const jogador = await Jogador.create({
      nome_jogador,
      posicao_jogador,
      id_time: time.id_time,
      altura_cm,
      peso_kg,
      idade,
      passes_certos,
      gols_marcados,
      assistencias,
      cartoes_amarelos,
      cartoes_vermelhos,
      finalizacoes,
    });

    return res.status(200).json({ ok: true, msg: 'Jogador registrado com sucesso.', jogador });
  } catch (error) {
    console.error('Erro ao cadastrar jogador:', error);
    const code = error.name || 'UNKNOWN_ERROR';
    const msg = error.message || 'erro';
    return res.status(200).json({ ok: false, reason: code, msg: `Erro ao cadastrar jogador (${code}): ${msg}` });
  }
};

// GET /api/jogador/listar
exports.listarJogadores = async (_req, res) => {
  try {
    const jogadores = await Jogador.findAll({
      include: [{ model: Time, attributes: ['nome_time'], required: false }],
      order: [['nome_jogador', 'ASC']],
    });

    // ARRAY PURO (front espera isto)
    const formatted = jogadores.map(j => ({
      id_jogador: j.id_jogador,
      nome_jogador: j.nome_jogador,
      posicao_jogador: j.posicao_jogador,
      nome_time: j.Time ? j.Time.nome_time : 'Sem time',
      altura_cm: j.altura_cm,
      peso_kg: j.peso_kg,
      idade: j.idade,
      passes_certos: j.passes_certos,
      gols_marcados: j.gols_marcados,
      assistencias: j.assistencias,
      cartoes_amarelos: j.cartoes_amarelos,
      cartoes_vermelhos: j.cartoes_vermelhos,
      finalizacoes: j.finalizacoes,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Erro ao listar jogadores:', error);
    // suave: [] para não quebrar o front
    return res.status(200).json([]);
  }
};

// PUT /api/jogador/atualizar/:id
exports.atualizarJogador = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome_jogador,
      posicao_jogador,
      nome_time,
      altura_cm,
      peso_kg,
      idade,
      passes_certos,
      gols_marcados,
      assistencias,
      cartoes_amarelos,
      cartoes_vermelhos,
      finalizacoes,
    } = req.body;

    const jogador = await Jogador.findByPk(id);
    if (!jogador) {
      return res.status(200).json({ ok: false, reason: 'not_found', msg: 'Jogador não encontrado.' });
    }

    // Buscar/criar time se informado
    let id_time = jogador.id_time;
    if (nome_time) {
      let time = await Time.findOne({ where: { nome_time } });
      if (!time) time = await Time.create({ nome_time, cidade_time: 'A definir' });
      id_time = time.id_time;
    }

    await jogador.update({
      nome_jogador: nome_jogador ?? jogador.nome_jogador,
      posicao_jogador: posicao_jogador ?? jogador.posicao_jogador,
      id_time,
      altura_cm: altura_cm ?? jogador.altura_cm,
      peso_kg: peso_kg ?? jogador.peso_kg,
      idade: idade ?? jogador.idade,
      passes_certos: passes_certos ?? jogador.passes_certos,
      gols_marcados: gols_marcados ?? jogador.gols_marcados,
      assistencias: assistencias ?? jogador.assistencias,
      cartoes_amarelos: cartoes_amarelos ?? jogador.cartoes_amarelos,
      cartoes_vermelhos: cartoes_vermelhos ?? jogador.cartoes_vermelhos,
      finalizacoes: finalizacoes ?? jogador.finalizacoes,
    });

    return res.status(200).json({ ok: true, msg: 'Jogador atualizado com sucesso.', jogador });
  } catch (err) {
    console.error('Erro ao atualizar jogador:', err);
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';
    return res.status(200).json({ ok: false, reason: code, msg: `Erro ao atualizar jogador (${code}): ${msg}` });
  }
};

// DELETE /api/jogador/deletar/:id
exports.deletarJogador = async (req, res) => {
  try {
    const { id } = req.params;
    const jogador = await Jogador.findByPk(id);
    if (!jogador) {
      return res.status(200).json({ ok: false, reason: 'not_found', msg: 'Jogador não encontrado.' });
    }

    await jogador.destroy();
    return res.status(200).json({ ok: true, msg: 'Jogador deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar jogador:', err);
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';
    return res.status(200).json({ ok: false, reason: code, msg: `Erro ao deletar jogador (${code}): ${msg}` });
  }
};

// GET /api/jogador/filtrar
exports.filtrarJogadores = async (req, res) => {
    try {
        const {
            nome_jogador,
            posicao_jogador,
            nome_time,
            idadeMin,
            idadeMax,
            gols_marcadosMin,
            assistenciasMin,
            passes_certosMin,
            cartoes_amarelosMax,
            cartoes_vermelhosMax,
            finalizacoesMin,
        } = req.query;

        const filtros = {};

        // Filtro por nome (busca parcial)
        if (nome_jogador) {
            filtros.nome_jogador = { [Op.like]: `%${nome_jogador}%` };
        }

        // Filtro por posição
        if (posicao_jogador) {
            filtros.posicao_jogador = posicao_jogador;
        }

        // Filtro por idade (intervalo)
        if (idadeMin || idadeMax) {
            filtros.idade = {};
            if (idadeMin) filtros.idade[Op.gte] = parseInt(idadeMin);
            if (idadeMax) filtros.idade[Op.lte] = parseInt(idadeMax);
        }

        // Filtro por estatísticas (mínimos e máximos)
        if (gols_marcadosMin) filtros.gols_marcados = { [Op.gte]: parseInt(gols_marcadosMin) };
        if (assistenciasMin) filtros.assistencias = { [Op.gte]: parseInt(assistenciasMin) };
        if (passes_certosMin) filtros.passes_certos = { [Op.gte]: parseInt(passes_certosMin) };
        if (cartoes_amarelosMax) filtros.cartoes_amarelos = { [Op.lte]: parseInt(cartoes_amarelosMax) };
        if (cartoes_vermelhosMax) filtros.cartoes_vermelhos = { [Op.lte]: parseInt(cartoes_vermelhosMax) };
        if (finalizacoesMin) filtros.finalizacoes = { [Op.gte]: parseInt(finalizacoesMin) };

        // Filtro por time (nome do time)
        let includeTime = { model: Time, attributes: ['nome_time'], required: false };
        if (nome_time) {
            includeTime.where = { nome_time: { [Op.like]: `%${nome_time}%` } };
            includeTime.required = true; // INNER JOIN se nome_time for especificado
        }

        const jogadores = await Jogador.findAll({
            where: filtros,
            include: [includeTime],
            order: [['nome_jogador', 'ASC']], // Ordena por nome
        });

        // Formata a resposta para o formato esperado pelo frontend
        const formatted = jogadores.map(j => ({
            id_jogador: j.id_jogador,
            nome_jogador: j.nome_jogador,
            posicao_jogador: j.posicao_jogador,
            nome_time: j.Time ? j.Time.nome_time : 'Sem time',
            altura_cm: j.altura_cm,
            peso_kg: j.peso_kg,
            idade: j.idade,
            passes_certos: j.passes_certos,
            gols_marcados: j.gols_marcados,
            assistencias: j.assistencias,
            cartoes_amarelos: j.cartoes_amarelos,
            cartoes_vermelhos: j.cartoes_vermelhos,
            finalizacoes: j.finalizacoes,
        }));

        return res.status(200).json(formatted);
    } catch (error) {
        console.error('Erro ao filtrar jogadores:', error);
        return res.status(200).json([]); // Retorna array vazio para não quebrar o frontend
    }
};