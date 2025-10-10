const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const key = process.env.SECRET_KEY; // defina no .env do server

// POST /api/olheiro/cadastrar
exports.cadastrarOlheiro = (req, res) => {
  const db = req.app.get("db");
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  const senhaHash = crypto.createHash("md5").update(senha).digest("hex");

  // Tabela e colunas conforme seu script SQL: olheiro(...)
  const sql =
    "INSERT INTO olheiro (admin, nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?, ?)";
  const values = [0, nome, email, senhaHash]; // admin = 0 por padrão

  db.query(sql, values, (err, result) => {
  if (err) {
    console.error("Erro ao cadastrar olheiro:", err); // log completo no server
    const code = err.code || "UNKNOWN";
    const msg = err.sqlMessage || err.message || "erro";
    return res
      .status(500)
      .json({ error: `Erro ao cadastrar olheiro (${code}): ${msg}` });
  }
  return res.status(201).json({ message: "ok", id: result.insertId });
});

};

// POST /api/olheiro/login
exports.login = (req, res) => {
  const db = req.app.get("db");
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  const senhaHash = crypto.createHash("md5").update(senha).digest("hex");

  const sql = `
    SELECT id_usuario, admin, nome_usuario, email_usuario
    FROM olheiro
    WHERE email_usuario = ? AND senha_usuario = ?
  `;

  db.query(sql, [email, senhaHash], (err, rows) => {
    if (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ error: "Erro no login" });
    }
    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const u = rows[0];
    const payload = {
      id: u.id_usuario,
      admin: u.admin,
      nome: u.nome_usuario,
      email: u.email_usuario,
      role: "olheiro",
    };

    const token = jwt.sign(payload, key, { expiresIn: "10h" });
    return res.status(200).json({ token, user: payload });
  });
};
