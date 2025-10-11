require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require('./config/database');
const rotaOlheiro = require("./routes/rotaOlheiro.js");
const rotaCampeonato = require("./routes/rotaCampeonato.js");
const rotaPartida = require("./routes/rotaPartidas.js");
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();

app.use(cors()); // libera no dev; ajuste se quiser restringir
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.set('sequelize', sequelize);

// Função assíncrona para sincronizar e semear o admin
const syncAndSeedAdmin = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Banco de dados sincronizado');

    // Verifica e cria usuário admin padrão
    const defaultAdmin = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123', // Será hasheado
      admin: 1,
    };

    const existingAdmin = await User.findOne({ where: { email: defaultAdmin.email } });
    if (!existingAdmin) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, saltRounds);
      await User.create({
        ...defaultAdmin,
        password: hashedPassword,
      });
      console.log('Usuário admin padrão criado:', defaultAdmin.email);
    } else {
      console.log('Usuário admin padrão já existe:', defaultAdmin.email);
    }
  } catch (err) {
    console.error('Erro ao sincronizar o banco de dados ou criar usuário admin:', err);
    throw err; // Rejoga o erro para ser capturado fora
  }
};

// Chama a função assíncrona e lida com o resultado
syncAndSeedAdmin().catch(err => {
  console.error('Falha na inicialização do banco de dados:', err);
  process.exit(1); // Encerra o processo se houver erro crítico
});

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
