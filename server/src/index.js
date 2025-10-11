require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require('./config/database');
const rotaOlheiro = require("./routes/rotaOlheiro.js");
const rotaCampeonato = require("./routes/rotaCampeonato.js");
const rotaPartida = require("./routes/rotaPartidas.js");

const app = express();

app.use(cors()); // libera no dev; ajuste se quiser restringir
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.set('sequelize', sequelize);

// Sincroniza modelos com o banco de dados
sequelize.sync({ force: false}).then(() => {
  console.log('Banco de dados sincronizado');

  // Verifica e cria usuário admin padrão
  const defaultAdmin = {
    name: 'Admin Default',
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
}).catch(err => {
  console.error('Erro ao sincronizar o banco de dados:', err);
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

