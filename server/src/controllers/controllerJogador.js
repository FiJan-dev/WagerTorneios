const { Jogador, Time } = require('../models/index');

// POST /api/jogador/cadastrar
exports.cadastrarJogador = async (req, res) => {
    try{
        const {
            nome_jogador,
            posicao_jogador,
            nome_time,
            altura_cm,
            peso_kg,
            idade,
            passes_certos=0,
            gols_marcados=0,
            assistencias=0,
            cartoes_amarelos=0,
            cartoes_vermelhos=0,
            finalizacoes=0,
        } = req.body;

        // Validacao minima
        if(!nome_jogador || !posicao_jogador || !nome_time){
            return res.status(400).json({ error: 'Nome do jogador, posicao e nome do time sao obrigatorios.' });
        }

        // Busca ou cria time
        let time = await Time.findOne({ where: { nome_time } });
        if(!time){
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

        return res.status(201).json({ message: "Jogador registrado com sucesso!", jogador });
    } catch (error) {
        console.error('Erro ao cadastrar jogador:', error);
        const code = error.name || 'UNKNOWN_ERROR';
        const msg = error.message || 'erro';
    return res.status(500).json({ error: `Erro ao cadastrar jogador (${code}): ${msg}` });    
    }
};

// GET /api/jogador/listar
exports.listarJogadores = async (req, res) => {
    try {
        const jogadores = await Jogador.findAll({
            include: [{ 
                model: Time, 
                attributes: ['nome_time'],
                required: false // LEFT JOIN ao invés de INNER JOIN
            }],
            order: [['nome_jogador', 'ASC']],
        });

        const formattedJogadores = jogadores.map(j => ({
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
        return res.status(200).json(formattedJogadores);
    } catch (error) {
        console.error('Erro ao listar jogadores:', error);
        return res.status(500).json({ error: 'Erro ao listar jogadores.' });
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
      return res.status(404).json({ error: "Jogador não encontrado." });
    }

    // Buscar ou criar time, se fornecido
    let id_time = jogador.id_time;
    if (nome_time) {
      let time = await Time.findOne({ where: { nome_time } });
      if (!time) {
        time = await Time.create({ nome_time, cidade_time: 'A definir' });
      }
      id_time = time.id_time;
    }

    // Atualizar jogador
    await jogador.update({
      nome_jogador: nome_jogador || jogador.nome_jogador,
      posicao_jogador: posicao_jogador || jogador.posicao_jogador,
      id_time: id_time,
      altura_cm: altura_cm !== undefined ? altura_cm : jogador.altura_cm,
      peso_kg: peso_kg !== undefined ? peso_kg : jogador.peso_kg,
      idade: idade !== undefined ? idade : jogador.idade,
      passes_certos: passes_certos !== undefined ? passes_certos : jogador.passes_certos,
      gols_marcados: gols_marcados !== undefined ? gols_marcados : jogador.gols_marcados,
      assistencias: assistencias !== undefined ? assistencias : jogador.assistencias,
      cartoes_amarelos: cartoes_amarelos !== undefined ? cartoes_amarelos : jogador.cartoes_amarelos,
      cartoes_vermelhos: cartoes_vermelhos !== undefined ? cartoes_vermelhos : jogador.cartoes_vermelhos,
      finalizacoes: finalizacoes !== undefined ? finalizacoes : jogador.finalizacoes,
    });

    return res.status(200).json({ message: "Jogador atualizado com sucesso.", jogador });
  } catch (err) {
    console.error("Erro ao atualizar jogador:", err);
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';
    return res.status(500).json({ error: `Erro ao atualizar jogador (${code}): ${msg}` });
  }
};

// DELETE /api/jogador/deletar/:id
exports.deletarJogador = async (req, res) => {
  try {
    const { id } = req.params;
    const jogador = await Jogador.findByPk(id);
    if (!jogador) {
      return res.status(404).json({ error: "Jogador não encontrado." });
    }

    await jogador.destroy();
    return res.status(200).json({ message: "Jogador deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar jogador:", err);
    const code = err.name || 'UNKNOWN_ERROR';
    const msg = err.message || 'erro';
    return res.status(500).json({ error: `Erro ao deletar jogador (${code}): ${msg}` });
  }
};