require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require('./config/database');
const rotaOlheiro = require("./routes/rotaOlheiro.js");
const rotaCampeonato = require("./routes/rotaCampeonato.js");
const rotaPartida = require("./routes/rotaPartidas.js");
const rotaJogador = require("./routes/rotaJogador.js");
const crypto = require('crypto');
const { Olheiro } = require('./models/index');
const { populate } = require('./scripts/popular');

const app = express();

app.use(cors()); // libera no dev; ajuste se quiser restringir
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.set('sequelize', sequelize);

// Função assíncrona para sincronizar e semear o admin
const syncAndSeed = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Banco de dados sincronizado');

    // 1. Cria admin
    const defaultAdmin = {
      admin: 1,
      nome_usuario: 'Admin',
      email_usuario: 'admin@example.com',
      senha_usuario: 'admin',
    };

    const existingAdmin = await Olheiro.findOne({ where: { email_usuario: defaultAdmin.email_usuario } });
    if (!existingAdmin) {
      const hashedPassword = crypto.createHash('md5').update(defaultAdmin.senha_usuario).digest('hex');
      await Olheiro.create({
        admin: defaultAdmin.admin,
        nome_usuario: defaultAdmin.nome_usuario,
        email_usuario: defaultAdmin.email_usuario,
        senha_usuario: hashedPassword,
      });
      console.log('Usuário admin criado:', defaultAdmin.email_usuario);
    } else {
      console.log('Admin já existe');
    }

    await populate(); 

  } catch (err) {
    console.error('Erro na inicialização:', err);
    process.exit(1);
  }
};

// Chama a função assíncrona e lida com o resultado
syncAndSeed().catch(err => {
  console.error('Falha na inicialização do banco de dados:', err);
  process.exit(1); // Encerra o processo se houver erro crítico
});

// Rotas
app.use("/api/olheiro", rotaOlheiro);
app.use("/api/campeonato", rotaCampeonato);
app.use("/api/partida", rotaPartida);
app.use("/api/jogador", rotaJogador);

// Healthcheck
app.get("/health", (_req, res) => {
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
