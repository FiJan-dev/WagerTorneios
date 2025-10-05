
const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;
const auth = require('../middleware/authmiddlaware.js');

exports.registrarPartida = async (req, res) => {
    const db = req.app.get('db');
    const sql = 'INSERT INTO partidas (id_campeonato, id_time_casa, id_time_visitante, data_partida, local_partida, placar_casa, placar_visitante) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const time = 'SELECT * FROM times WHERE nome_time = ?';

    const times = [
        req.body.time_casa, 
        req.body.time_visitante,
        req.body.nome_campeonato
    ];

    const [campeonato] = await db.query('SELECT * FROM campeonatos WHERE nome_campeonato = ?', [times[2]]);
    if (campeonato.length === 0) {
        return res.status(400).json({ error: 'Campeonato não encontrado' });
    }
    const idCampeonato = campeonato[0].id_campeonato;

    const [timeCasa] = await db.query(time, [times[0]]);
    if (timeCasa.length === 0) {
        return res.status(400).json({ error: 'Time da casa não encontrado' });
    }
    const idTimeCasa = timeCasa[0].id_time;

    const [timeVisitante] = await db.query(time, [times[1]]);
    if (timeVisitante.length === 0) {
        return res.status(400).json({ error: 'Time visitante não encontrado' });
    }
    const idTimeVisitante = timeVisitante[0].id_time;

    if(idTimeCasa === idTimeVisitante) {
        return res.status(400).json({ error: 'Os times não podem ser iguais' });
    }

    const values = [
        idCampeonato,
        idTimeCasa,
        idTimeVisitante,
        req.body.data_partida,
        req.body.local_partida,
        req.body.placar_casa,
        req.body.placar_visitante
    ];

    const data = new Date();

    if (new Date(req.body.data_partida) < data) {
        return res.status(400).json({ error: 'A data da partida não pode ser no passado' });   
    }
    await db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao registrar partida:', err);
            return res.status(500).json({ error: 'Erro ao registrar partida' });
        }
        res.status(201).json({ message: 'Partida registrada com sucesso', id: result.id_partida });
    });
};

exports.listarPartidas = async (req, res) => {
  const db = req.app.get('db');
  const sql = `
    SELECT p.id_partida, p.id_campeonato, p.data_partida, p.local_partida, p.placar_casa, p.placar_visitante,
           c.nome_campeonato, tc.nome_time AS nome_time_casa, tv.nome_time AS nome_time_visitante
    FROM partidas p
    JOIN campeonatos c ON p.id_campeonato = c.id_campeonato
    JOIN times tc ON p.id_time_casa = tc.id_time
    JOIN times tv ON p.id_time_visitante = tv.id_time
  `;

  try {
    const [results] = await db.query(sql); 
    const resultados = results.map((partida) => ({
      nome_campeonato: partida.nome_campeonato,
      nome_time_casa: partida.nome_time_casa,
      nome_time_visitante: partida.nome_time_visitante,
      data_partida: partida.data_partida,
      local_partida: partida.local_partida || null,
      placar_casa: partida.placar_casa,
      placar_visitante: partida.placar_visitante,
    }));
    res.status(200).json(resultados);
  } catch (err) {
    console.error('Erro ao listar partidas:', err);
    res.status(500).json({ error: 'Erro ao listar partidas' });
  }
};