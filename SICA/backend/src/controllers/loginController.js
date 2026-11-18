import z from "zod";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

import db from "../config/database.js";
import criarErro from "../utils/criarErro.js";

export const login = async (req, res, next) => {
  // Validação inicial dos dados
  const loginSchema = z.object({
    identificador: z.string().trim().min(1, "Informe seu CPF ou CRM"),
    senha: z.string().min(1, "Informe sua senha"),
  });

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      criarErro(result.error.issues[0].message || "Dados inválidos", 400),
    );
  }

  // separando cpf de crm
  let { identificador, senha } = result.data;

  identificador = identificador.trim().toUpperCase();

  const cpf = identificador.replace(/[.\-\s]/g, "");
  const crm = identificador.replace(/\s/g, "");

  // restante da lógica do login
  if (/^\d{11}$/.test(cpf)) {
    const userDB = await db.query(
      "SELECT u.id_usuario, u.nome_usuario, u.senha_usuario, (a.id_admin IS NOT NULL) AS is_admin, (f.id_funcionario IS NOT NULL) AS is_funcionario FROM usuario u LEFT JOIN admin a ON a.id_usuario = u.id_usuario LEFT JOIN funcionario f ON f.id_usuario = u.id_usuario WHERE f.cpf_funcionario = $1 OR a.cpf_admin = $1;",
      [cpf],
    );
    
    // Vendo se email existe no banco
    if (userDB.rows.length === 0) {
      return next(criarErro("Credenciais inválidas", 401));
    }
    
    // Verificando a senha
    const isMatch = await bcrypt.compare(senha, userDB.rows[0].senha_usuario);
    
    if (!isMatch) {
      return next(criarErro("Credenciais inválidas", 401));
    }

    // Verificando a permissão
    const papeis = [];
    if (userDB.rows[0].is_admin) papeis.push("ADMIN");
    if (userDB.rows[0].is_funcionario) papeis.push("FUNCIONARIO");

     // criando token
    const token = JWT.sign(
      {
        id: userDB.rows[0].id_usuario,
        papeis: papeis,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Provavelmente será necessário mudar algumas dessas
    // configurações quando for hospedar o projeto de fato
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      mensagem: "Login bem-sucedido",
      nome: userDB.rows[0].nome_usuario,
      papeis: papeis,
    });
  } else if (/^\d{5}-[A-Z]{2}$/.test(crm)) {
    const userDB = await db.query(
      "SELECT u.id_usuario, u.nome_usuario, u.senha_usuario, (m.id_usuario IS NOT NULL) AS is_medico FROM usuario u INNER JOIN medico m ON u.id_usuario = m.id_usuario WHERE crm = $1;",
      [crm],
    );

    if (userDB.rows.length === 0) {
      return next(criarErro("Credenciais inválidas", 401));
    }

    // Verificando a senha
    const isMatch = await bcrypt.compare(senha, userDB.rows[0].senha_usuario);

    if (!isMatch) {
      return next(criarErro("Credenciais inválidas", 401));
    }

    const papeis = [];
    if (userDB.rows[0].is_medico) papeis.push("MEDICO");

    // criando token
    const token = JWT.sign(
      {
        id: userDB.rows[0].id_usuario,
        papeis: papeis,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      mensagem: "Login bem-sucedido",
      nome: userDB.rows[0].nome_usuario,
      papeis: papeis,
    });
  } else {
    return next(criarErro("Identificador inválido", 400));
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({ message: "Logout realizado" });
};
