// server/src/controllers/controllerPartidas.js

// Cadastra a partida criando campeonato e times automaticamente se não existirem.
exports.registrarPartida = async (req, res) => {
  try {
    const pool = req.app.get("db").promise();

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
    if (time_casa.trim() === time_visitante.trim()) {
      return res.status(400).json({ error: "Os times não podem ser iguais." });
    }
    const dt = new Date(data_partida);
    if (isNaN(dt.getTime())) {
      return res.status(400).json({ error: "Data da partida inválida." });
    }

    // helpers: find-or-create
    const findOrCreateCampeonato = async (nome, dataJogo, localCamp) => {
      const [c] = await pool.query(
        "SELECT id_campeonato FROM campeonatos WHERE nome_campeonato = ? LIMIT 1",
        [nome]
      );
      if (c.length) return c[0].id_campeonato;

      // campeonatos pede data_inicio, data_fim e local_campeonato (NOT NULL)
      const dataISO = dataJogo.toISOString().slice(0, 10); // YYYY-MM-DD
      const local = localCamp || "A definir";
      const [ins] = await pool.query(
        "INSERT INTO campeonatos (nome_campeonato, data_inicio, data_fim, local_campeonato) VALUES (?, ?, ?, ?)",
        [nome, dataISO, dataISO, local]
      );
      return ins.insertId;
    };

    const findOrCreateTime = async (nomeTime) => {
      const [t] = await pool.query(
        "SELECT id_time FROM times WHERE nome_time = ? LIMIT 1",
        [nomeTime]
      );
      if (t.length) return t[0].id_time;

      // times.cidade_time é NOT NULL — usamos um default simples
      const [ins] = await pool.query(
        "INSERT INTO times (nome_time, cidade_time) VALUES (?, ?)",
        [nomeTime, "A definir"]
      );
      return ins.insertId;
    };

    // cria se não existir
    const idCampeonato     = await findOrCreateCampeonato(nome_campeonato, dt, local_partida);
    const idTimeCasa       = await findOrCreateTime(time_casa);
    const idTimeVisitante  = await findOrCreateTime(time_visitante);

    if (idTimeCasa === idTimeVisitante) {
      return res.status(400).json({ error: "Os times não podem ser iguais." });
    }

    // grava a partida
    const insertSQL = `
      INSERT INTO partidas
        (id_campeonato, id_time_casa, id_time_visitante, data_partida, local_partida, placar_casa, placar_visitante)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      idCampeonato,
      idTimeCasa,
      idTimeVisitante,
      data_partida,
      local_partida,
      placar_casa,
      placar_visitante,
    ];
    const [result] = await pool.query(insertSQL, params);

    return res.status(201).json({ message: "Partida registrada com sucesso", id: result.insertId });
  } catch (err) {
    console.error("Erro ao registrar partida:", err);
    const code = err.code || "UNKNOWN";
    const msg = err.sqlMessage || err.message || "erro";
    return res.status(500).json({ error: `Erro ao registrar partida (${code}): ${msg}` });
  }
};

exports.listarPartidas = async (_req, res) => {
  try {
    const pool = req.app.get("db").promise();
    const sql = `
      SELECT p.id_partida, p.data_partida, p.local_partida,
             p.placar_casa, p.placar_visitante,
             c.nome_campeonato,
             tc.nome_time AS nome_time_casa,
             tv.nome_time AS nome_time_visitante
      FROM partidas p
      JOIN campeonatos c ON p.id_campeonato = c.id_campeonato
      JOIN times tc ON p.id_time_casa = tc.id_time
      JOIN times tv ON p.id_time_visitante = tv.id_time
      ORDER BY p.data_partida ASC
    `;
    const [rows] = await pool.query(sql);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao listar partidas:", err);
    return res.status(500).json({ error: "Erro ao listar partidas" });
  }
};
