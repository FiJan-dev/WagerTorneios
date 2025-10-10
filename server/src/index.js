require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const rotaOlheiro = require("./routes/rotaOlheiro.js");
const rotaCampeonato = require("./routes/rotaCampeonato.js");
const rotaPartida = require("./routes/rotaPartidas.js");

const app = express();

app.use(cors()); // libera no dev; ajuste se quiser restringir
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// === Pool do MariaDB (gera/reaproveita conexões e se recupera sozinho) ===
const db = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "dev",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "wagerdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
app.set("db", db);
console.log("Pool do MariaDB pronto.");

// Rotas
app.use("/api/olheiro", rotaOlheiro);
app.use("/api/campeonato", rotaCampeonato);
app.use("/api/partida", rotaPartida);

// Healthcheck
app.get("/", (_req, res) => {
  res.send("API funcionando!");
});

// Start
const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Handler de erro final
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});
