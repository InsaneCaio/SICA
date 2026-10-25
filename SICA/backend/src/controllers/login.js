import z from 'zod';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

import db from '../database/db.js';
import criarErro from '../utils/criarErro.js';

// remover depois:
const login = async (req, res, next) => {

  // Validação inicial dos dados
  const loginSchema = z.object({
    identificador: z.string().trim().min(1, 'Informe seu CPF ou CRM'),
    senha: z.string().min(1, 'Informe sua senha')
  });

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      criarErro(result.error.issues[0].message || "Dados inválidos", 400),
    );
  }
  
  // separando cpf de crm
  let {identificador, senha} = result.data;

  identificador = identificador.trim().toUpperCase();

  const cpf = identificador.replace(/[.\-\s]/g, "");
  const crm = identificador.replace(/\s/g, "");

  // restante da lógica do login
  if (/^\d{11}$/.test(cpf)) {
    
    // Vendo se email existe no banco
    const userDB = await db.query(
      "SELECT u.id_usuario, f.cpf_funcionario, a.cpf_admin, u.senha_usuario, u.tipo_usuario FROM usuario u LEFT JOIN admin a ON u.id_usuario = a.id_usuario LEFT JOIN funcionario f ON u.id_usuario = f.id_usuario WHERE f.cpf_funcionario=$1 OR a.cpf_admin=$1",
      [cpf],
    );

    if (userDB.rows.length === 0) {
      return next(criarErro('Credenciais inválidas', 401));
    }

    // Verificando a senha
    const isMatch = await bcrypt.compare(senha, userDB.rows[0].senha_usuario);

    if (!isMatch) {
      return next(criarErro('Credenciais inválidas', 401));
    }

    // criando token
    const token = JWT.sign(
      {
        id: userDB.rows[0].id_usuario,
        tipo: userDB.rows[0].tipo_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Provavelmente será necessário mudar algumas dessas
    // configurações quando for hospedar o projeto de fato
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // mudar pra true depois
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({mensagem: 'Login bem-sucedido'});
    
    
  } else if (/^\d{5}-[A-Z]{2}$/.test(crm)) {

    const userDB = await db.query(
      "SELECT u.id_usuario, m.crm, u.senha_usuario, u.tipo_usuario FROM usuario u INNER JOIN medico m ON u.id_usuario = m.id_usuario WHERE crm=$1",
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

    // criando token
    const token = JWT.sign(
      {
        id: userDB.rows[0].id_usuario,
        tipo: userDB.rows[0].tipo_usuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Provavelmente será necessário mudar algumas dessas
    // configurações quando for hospedar o projeto de fato
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // mudar pra true depois 
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ mensagem: "Login bem-sucedido" });

  } else {
    return next(criarErro('Identificador inválido', 400));
  }  

};

export default login;