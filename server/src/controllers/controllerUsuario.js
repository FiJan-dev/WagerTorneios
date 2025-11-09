const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Olheiro = require("../models/Olheiro");

const key = process.env.SECRET_KEY; // defina no .env do server

// POST /api/olheiro/cadastrar
exports.cadastrarOlheiro = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  const senhaHash = crypto.createHash("md5").update(senha).digest("hex");

  const olheiro = await Olheiro.create({
    admin: 0,
    nome_usuario: nome,
    email_usuario: email,
    senha_usuario: senhaHash,
  });

  return res.status(201).json({ message: "ok", id: olheiro.id_usuario });
  } catch (err) {
    console.error("Erro ao cadastrar olheiro:", err);
    const code = err.code || "UNKNOWN";
    const msg = err.message || 'erro';
    return res.status(500).json({ error: `Erro ao cadastrar olheiro (${code}): ${msg}` });
  }
};

// POST /api/olheiro/login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const senhaHash = crypto.createHash("md5").update(senha).digest("hex");

    const olheiro = await Olheiro.findOne({
      where: { email_usuario: email, senha_usuario: senhaHash },
      attributes: ['id_usuario', 'admin', 'nome_usuario', 'email_usuario'],
    });

    if(!olheiro) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const payload = {
      id: olheiro.id_usuario,
      admin: olheiro.admin,
      nome: olheiro.nome_usuario,
      email: olheiro.email_usuario,
      role: 'olheiro',
    };

    const token = jwt.sign(payload, key, { expiresIn: '10h' });
    return res.status(200).json({ token, user: payload });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    return res.status(500).json({ error: "Erro ao fazer login." });
  }
};

exports.atualizarSenha = async (req, res) => {
  try {
    const { email } = req.params;
    const { nova_senha } = req.body;

    const novaSenhaHash = crypto.createHash("md5").update(nova_senha).digest("hex");

    const olheiro = await Olheiro.findOne({ where: {email_usuario: email} });
    if (!olheiro) {
      return res.status(404).json({ error: "Olheiro não encontrado." });
    }
    
    olheiro.senha_usuario = novaSenhaHash;
    await olheiro.save();
    return res.status(200).json({ message: "Senha atualizada com sucesso." });
  }
  catch (err) {
    console.error("Erro ao atualizar senha do olheiro:", err);
    return res.status(500).json({ error: "Erro ao atualizar senha do olheiro." });
  }
};
