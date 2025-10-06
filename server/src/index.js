require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const port = process.env.SERVER_PORT;
const rotaOlheiro = require("./routes/rotaOlheiro.js");
const rotaCampeonato = require("./routes/rotaCampeonato.js");
const rotaPartida = require("./routes/rotaPartidas.js"); 

const app = express(); 
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.set("db", db);

db.connect((err) => {
  if (err) return console.error("Erro ao conectar com MariaDB:", err);
  console.log("Conectado ao MariaDB!");
});

app.set('db', db)

app.use('/api', rotaOlheiro);
app.use('/api', rotaCampeonato);
app.use('/api', rotaPartida);

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.listen(port, () => {
  console.log("Servidor rodando na porta 5000");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});