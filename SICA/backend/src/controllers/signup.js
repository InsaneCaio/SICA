import z from "zod";
import bcrypt from "bcrypt";

import db from "../database/db.js";
import criarErro from "../utils/criarErro.js";

const signup = async (req, res, next) => {
  // VALIDANDO DADOS COM ZOD
  const signupSchema = z.object({
    nome: z.string().trim().min(1, "Nome obrigatório!"),
    cpf: z.string().regex(/^\d{11}$/, "O CPF deve conter 11 dígitos"),
    email: z.email("E-mail inválido").toLowerCase(),
    senha: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve ter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve ter pelo menos um caractere especial",
      ),
  });

  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      criarErro(result.error.issues[0].message || "Dados inválidos", 400),
    );
  }

  const dados = result.data;
  const tipoUsuario = "PACIENTE";

  // Verifacando se email existe no banco
  const userEmail = await db.query(
    'SELECT emailUsuario FROM usuario WHERE emailUsuario=$1',
    [dados.email]
  );
  if (userEmail.rows.length) {
    return next(criarErro("Email já cadastrado por outro usuário", 400));
  }

  // Verificando se CPF é repetido
  const userCpf = await db.query(
    'SELECT cpf FROM paciente WHERE cpf=$1',
    [dados.cpf]
  );
  if (userCpf.rows.length) {
    return next(criarErro("CPF já cadastrado por outro usuário", 400));
  }

  // Encriptando a senha
  const senhaEncriptada = await bcrypt.hash(dados.senha, 10);

  // Inserindo usuário no banco
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      `INSERT INTO usuario (tipoUsuario, nomeUsuario, emailUsuario, senhaUsuario)
     VALUES ($1, $2, $3, $4) RETURNING idUsuario AS "idUsuario"`,
      [tipoUsuario, dados.nome, dados.email, senhaEncriptada],
    );
    const idUsuario = userRes.rows[0].idUsuario;

    await client.query(
      `INSERT INTO paciente (idUsuario, CPF, tipoUsuarioRef)
     VALUES ($1, $2, $3)`,
      [idUsuario, dados.cpf, tipoUsuario],
    );

    await client.query("COMMIT");
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(criarErro(error.message || "Erro interno do servidor", 500));
  } finally {
    client.release();
  }
};

export default signup;
