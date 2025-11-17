const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Olheiro = require("../models/Olheiro");

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
    aprovado: 0, // Pendente de aprovação
    nome_usuario: nome,
    email_usuario: email,
    senha_usuario: senhaHash,
  });

  return res.status(201).json({ 
    message: "Cadastro realizado com sucesso! Aguarde a aprovação do administrador.", 
    id: olheiro.id_usuario,
    aprovado: false
  });
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
      attributes: ['id_usuario', 'admin', 'aprovado', 'nome_usuario', 'email_usuario', 'foto_perfil'],
    });

    if(!olheiro) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Verificar se o olheiro foi aprovado (exceto se for admin)
    if (olheiro.admin !== 1 && olheiro.aprovado !== 1) {
      const statusMsg = olheiro.aprovado === 0 
        ? "Sua conta está pendente de aprovação pelo administrador." 
        : "Sua conta foi rejeitada pelo administrador.";
      return res.status(403).json({ error: statusMsg, aprovado: olheiro.aprovado });
    }

    const payload = {
      id: olheiro.id_usuario,
      admin: olheiro.admin,
      nome: olheiro.nome_usuario,
      email: olheiro.email_usuario,
      // Não incluir foto_perfil no token para evitar headers muito grandes
      // foto_perfil: olheiro.foto_perfil,
      role: 'olheiro',
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10h' });
    
    // Retornar foto_perfil separadamente do token
    return res.status(200).json({ 
      token, 
      user: {
        ...payload,
        foto_perfil: olheiro.foto_perfil
      }
    });
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

exports.excluirOlheiro = async (req, res) => {
  try {
    const { id } = req.params;
    const olheiro = await Olheiro.findByPk(id);
    if (!olheiro) {
      return res.status(404).json({ error: "Olheiro não encontrado." });
    }
    
    // Não permitir excluir admin principal
    if (olheiro.admin === 1 && olheiro.email_usuario === 'admin@example.com') {
      return res.status(403).json({ error: "Não é possível excluir o administrador principal." });
    }
    
    await olheiro.destroy();
    return res.status(200).json({ message: "Olheiro excluído com sucesso." });
  }
  catch (err) {
    console.error("Erro ao excluir olheiro:", err);
    return res.status(500).json({ error: "Erro ao excluir olheiro." });
  }
};

// GET /api/olheiro/listar - Lista todos os olheiros (apenas admin)
exports.listarOlheiros = async (req, res) => {
  try {
    const olheiros = await Olheiro.findAll({
      attributes: ['id_usuario', 'admin', 'aprovado', 'nome_usuario', 'email_usuario'],
      order: [['aprovado', 'ASC'], ['id_usuario', 'DESC']]
    });

    const formatted = olheiros.map(o => ({
      id_usuario: o.id_usuario,
      nome_usuario: o.nome_usuario,
      email_usuario: o.email_usuario,
      admin: o.admin,
      aprovado: o.aprovado,
      status: o.aprovado === 0 ? 'Pendente' : o.aprovado === 1 ? 'Aprovado' : 'Rejeitado'
    }));

    return res.status(200).json({ ok: true, olheiros: formatted });
  } catch (err) {
    console.error("Erro ao listar olheiros:", err);
    return res.status(500).json({ ok: false, error: "Erro ao listar olheiros." });
  }
};

// PUT /api/olheiro/aprovar/:id - Aprovar olheiro (apenas admin)
exports.aprovarOlheiro = async (req, res) => {
  try {
    const { id } = req.params;
    const olheiro = await Olheiro.findByPk(id);
    
    if (!olheiro) {
      return res.status(404).json({ ok: false, error: "Olheiro não encontrado." });
    }

    if (olheiro.admin === 1) {
      return res.status(400).json({ ok: false, error: "Administradores não precisam de aprovação." });
    }

    olheiro.aprovado = 1;
    await olheiro.save();

    return res.status(200).json({ ok: true, message: "Olheiro aprovado com sucesso." });
  } catch (err) {
    console.error("Erro ao aprovar olheiro:", err);
    return res.status(500).json({ ok: false, error: "Erro ao aprovar olheiro." });
  }
};

// PUT /api/olheiro/rejeitar/:id - Rejeitar olheiro (apenas admin)
exports.rejeitarOlheiro = async (req, res) => {
  try {
    const { id } = req.params;
    const olheiro = await Olheiro.findByPk(id);
    
    if (!olheiro) {
      return res.status(404).json({ ok: false, error: "Olheiro não encontrado." });
    }

    if (olheiro.admin === 1) {
      return res.status(400).json({ ok: false, error: "Não é possível rejeitar um administrador." });
    }

    olheiro.aprovado = 2;
    await olheiro.save();

    return res.status(200).json({ ok: true, message: "Olheiro rejeitado." });
  } catch (err) {
    console.error("Erro ao rejeitar olheiro:", err);
    return res.status(500).json({ ok: false, error: "Erro ao rejeitar olheiro." });
  }
};

// PUT /api/olheiro/atualizar-foto/:id - Atualizar foto de perfil
exports.atualizarFotoPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { foto_perfil } = req.body;

    console.log('=== ATUALIZAR FOTO DE PERFIL ===');
    console.log('ID do usuário:', id);
    console.log('Usuário autenticado:', req.user);
    console.log('Foto recebida (primeiros 100 chars):', foto_perfil?.substring(0, 100));

    if (!foto_perfil) {
      return res.status(400).json({ ok: false, error: "Foto de perfil é obrigatória." });
    }

    const olheiro = await Olheiro.findByPk(id);
    
    if (!olheiro) {
      console.log('Olheiro não encontrado');
      return res.status(404).json({ ok: false, error: "Olheiro não encontrado." });
    }

    // Verificar se o usuário está atualizando sua própria foto (req.user é definido pelo middleware de autenticação)
    if (req.user && req.user.id !== parseInt(id) && req.user.admin !== 1) {
      console.log('Tentativa de atualizar foto de outro usuário');
      return res.status(403).json({ ok: false, error: "Você só pode atualizar sua própria foto de perfil." });
    }

    olheiro.foto_perfil = foto_perfil;
    await olheiro.save();

    console.log('Foto de perfil atualizada com sucesso');

    return res.status(200).json({ 
      ok: true, 
      message: "Foto de perfil atualizada com sucesso.",
      foto_perfil: olheiro.foto_perfil 
    });
  } catch (err) {
    console.error("Erro ao atualizar foto de perfil:", err);
    return res.status(500).json({ ok: false, error: "Erro ao atualizar foto de perfil." });
  }
};
