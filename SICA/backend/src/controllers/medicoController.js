import z from "zod";
import bcrypt from "bcrypt";

import upload from "../middleware/imgUpload.js";
import { enviarParaCloudinary } from "../utils/enviarParaCloudinary.js";
import db from "../config/database.js";
import criarErro from "../utils/criarErro.js";

export const listarTodosMedicos = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT u.id_usuario, u.nome_usuario, u.email_usuario, u.telefone_usuario, u.foto_url, m.id_medico, m.crm, m.sobre_medico, m.valor_consulta, m.status_medico, COALESCE( json_agg( json_build_object( 'id', e.id_especialidade, 'nome', e.nome_especialidade ) ) FILTER (WHERE e.id_especialidade IS NOT NULL), '[]' ) AS especialidades FROM usuario u INNER JOIN medico m ON u.id_usuario = m.id_usuario LEFT JOIN medico_especialidade me ON m.id_medico = me.id_medico LEFT JOIN especialidade e ON me.id_especialidade = e.id_especialidade GROUP BY u.id_usuario, m.id_medico",
    );
    //const result = await db.query('SELECT u.nome_usuario, m.crm, m.especialidade_medico FROM usuario u INNER JOIN medico m ON u.id_usuario = m.id_usuario');

    res.status(200).json(result.rows);
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }
};

export const listarMedico = async (req, res, next) => {
  const idMedico = req.params.id;

  try {
    const result = await db.query(
      "SELECT * FROM vw_medicos WHERE id_medico = $1",
      [idMedico],
    );
    // const result = await db.query(
    //   "SELECT u.id_usuario, u.nome_usuario, u.email_usuario, u.telefone_usuario, u.foto_url, m.id_medico, m.crm, m.sobre_medico, m.valor_consulta, m.status_medico, COALESCE( json_agg( json_build_object( 'id', e.id_especialidade, 'nome', e.nome_especialidade ) ) FILTER (WHERE e.id_especialidade IS NOT NULL), '[]' ) AS especialidades FROM usuario u INNER JOIN medico m ON u.id_usuario = m.id_usuario LEFT JOIN medico_especialidade me ON m.id_medico = me.id_medico LEFT JOIN especialidade e ON me.id_especialidade = e.id_especialidade WHERE m.id_medico = $1 GROUP BY u.id_usuario, m.id_medico;",
    //   [idMedico],
    // );

    if (result.rows.length === 0) {
      return next(criarErro("Médico não encontrado", 404));
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(criarErro("Erro ao listar médico", 500));
  }
};

export const criarMedico = async (req, res, next) => {
  // PARA FAZER VALIDAÇÃO
  const DiaSemanaEnum = z.enum([
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
  ]);

  // SCHEMA ZOD PARA VALIDAR DADOS
  const medicoSchema = z
    .object({
      nome: z.string().trim().min(1, "Nome Obrigatório"),
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
      sobre: z.string().trim().optional(),
      CRM: z
        .string()
        .min(1, "CRM Obrigatório")
        .regex(/^\d{4,7}\s*[-/]?\s*[A-Za-z]{2}$/, "CRM inválido"),
      especialidade: z.preprocess(
        (val) => {
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch {
              return val;
            }
          }
          return val;
        },
        z
          .array(z.number().int().positive("ID de especialidade inválido"))
          .min(1, "Informe ao menos uma especialidade"),
      ),
      valorConsulta: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? undefined : val,
        z.coerce
          .number()
          .min(0, "O valor da consulta deve ser positivo ou zero")
          .optional(),
      ),
      email: z.email("E-mail inválido").toLowerCase(),
      telefone: z.string().min(10, "Telefone Obrigatório"),
      diasAtendimento: z.preprocess(
        (val) => {
          // Se vier como texto '["SEGUNDA", "QUINTA"]', faz o parse para array real
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch {
              return [val]; // Se mandar só "SEGUNDA" solto
            }
          }
          return val;
        },
        z
          .array(DiaSemanaEnum, {
            required_error: "Dias de atendimento são obrigatórios",
            invalid_type_error: "Dias de atendimento deve ser uma lista",
          })
          .min(1, "O médico deve atender em pelo menos um dia da semana"),
      ),
      horaInicio: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Horário inválido. Use o formato HH:mm (ex: 08:00 ou 17:30)",
        ),
      horaFim: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Horário inválido. Use o formato HH:mm (ex: 08:00 ou 17:30)",
        ),
      intervaloMinutos: z.coerce
        .number()
        .int("O intervalo deve ser um número inteiro")
        .min(5, "Mínimo de 5 minutos")
        .max(60, "Máximo de 60 minutos"),
    })
    .refine(
      // Validando se horaFim é maior que horaInicio
      (dados) => {
        return dados.horaFim > dados.horaInicio;
      },
      {
        message: "O horário de término deve ser posterior ao horário de início",
        path: ["horaFim"],
      },
    );

  // FAZENDO A VALIDAÇÃO
  const resultado = medicoSchema.safeParse(req.body);

  // VERIFICANDO SE DEU CERTO
  if (!resultado.success) {
    return next(
      criarErro(resultado.error.issues[0].message || "Dados inválidos", 400),
    );
  }

  // ARMAZENANDO OS DADOS NA VARIÁVEL dados
  const dados = resultado.data;

  // VALIDANDO EMAIL E CRM
  try {
    const userEmail = await db.query(
      `SELECT email_usuario FROM usuario WHERE email_usuario = $1`,
      [dados.email],
    );

    const userCRM = await db.query(`SELECT crm FROM medico WHERE crm = $1`, [
      dados.CRM,
    ]);

    if (userEmail.rows.length) {
      return next(criarErro("Email já cadastrado por outro usuário", 400));
    }
    if (userCRM.rows.length) {
      return next(criarErro("CRM já cadastrado por outro usuário", 400));
    }
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }

  // ENCRIPTANDO A SENHA
  const senhaEncriptada = await bcrypt.hash(dados.senha, 10);

  // INSERINDO MÉDICO NO BANCO DE DADOS
  let fotoUrl = null;
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      'INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario AS "idUsuario"',
      [dados.nome, dados.email, senhaEncriptada, dados.telefone, fotoUrl],
    );

    const idUsuario = userRes.rows[0].idUsuario;

    // Mandar a foto para o cloudinary

    if (req.file) {
      const fotoResult = await enviarParaCloudinary(
        req.file.buffer,
        idUsuario,
        "medicos",
      );
      fotoUrl = fotoResult.secure_url;
    }

    const userRes2 = await client.query(
      'INSERT INTO medico (crm, id_usuario, sobre_medico, valor_consulta) VALUES ($1, $2, $3, $4) RETURNING id_medico AS "idMedico"',
      [dados.CRM, idUsuario, dados.sobre, dados.valorConsulta],
    );

    const idMedico = userRes2.rows[0].idMedico;

    for (const element of dados.diasAtendimento) {
      await client.query(
        "INSERT INTO horario_medico (id_medico, dia_semana, hora_inicio, hora_fim, intervalo_minutos) VALUES ($1, $2, $3, $4, $5)",
        [
          idMedico,
          element,
          dados.horaInicio,
          dados.horaFim,
          dados.intervaloMinutos,
        ],
      );
    }

    for (const id of dados.especialidade) {
      await client.query(
        "INSERT INTO medico_especialidade (id_medico, id_especialidade) VALUES ($1, $2)",
        [idMedico, id],
      );
    }

    await client.query(
      "UPDATE usuario SET foto_url = $1 WHERE id_usuario = $2",
      [fotoUrl, idUsuario],
    );

    await client.query("COMMIT");

    res.status(201).json({ message: "Médico cadastrado com sucesso" });
  } catch (error) {

    await client.query("ROLLBACK");
    return next(criarErro(error.message || "Erro interno do servidor", 500));

  } finally {
    client.release();
  }
};

export const editarMedico = async (req, res, next) => {
  const idMedico = req.params.id;
  let consulta;
  try {
    consulta = await db.query(
      "SELECT id_usuario FROM medico WHERE id_medico = $1",
      [idMedico],
    );
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }

  // verifica se médico existe
  if (consulta.rows.length === 0) {
    return next(criarErro("Medico não encontrado", 404));
  }

  const idUsuarioMedico = consulta.rows[0].id_usuario;

  // PARA FAZER VALIDAÇÃO
  const DiaSemanaEnum = z.enum([
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
  ]);

  // SCHEMA ZOD PARA VALIDAR DADOS
  const medicoSchema = z
    .object({
      nome: z.string().trim().min(1, "Nome Obrigatório"),
      senha: z.preprocess(
        (val) =>
          !val || val === "null" || val === "undefined" ? undefined : val,
        z
          .string()
          .min(8, "A senha deve ter no mínimo 8 caracteres")
          .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula")
          .regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula")
          .regex(/[0-9]/, "A senha deve ter pelo menos um número")
          .regex(
            /[^A-Za-z0-9]/,
            "A senha deve ter pelo menos um caractere especial",
          )
          .optional(),
      ),
      sobre: z.string().trim().optional(),
      CRM: z
        .string()
        .min(1, "CRM Obrigatório")
        .regex(/^\d{4,7}\s*[-/]?\s*[A-Za-z]{2}$/, "CRM inválido"),
      especialidade: z.preprocess(
        (val) => {
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch {
              return val;
            }
          }
          return val;
        },
        z
          .array(z.number().int().positive("ID de especialidade inválido"))
          .min(1, "Informe ao menos uma especialidade"),
      ),
      valorConsulta: z.preprocess(
        (val) =>
          val === "" || val === null || val === undefined ? undefined : val,
        z.coerce
          .number()
          .min(0, "O valor da consulta deve ser positivo ou zero")
          .optional(),
      ),
      email: z.email("E-mail inválido").toLowerCase(),
      telefone: z.string().min(10, "Telefone Obrigatório"),
      diasAtendimento: z.preprocess(
        (val) => {
          // Se vier como texto '["SEGUNDA", "QUINTA"]', faz o parse para array real
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch {
              return [val]; // Se mandar só "SEGUNDA" solto
            }
          }
          return val;
        },
        z
          .array(DiaSemanaEnum, {
            required_error: "Dias de atendimento são obrigatórios",
            invalid_type_error: "Dias de atendimento deve ser uma lista",
          })
          .min(1, "O médico deve atender em pelo menos um dia da semana"),
      ),
      horaInicio: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Horário inválido. Use o formato HH:mm (ex: 08:00 ou 17:30)",
        ),
      horaFim: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "Horário inválido. Use o formato HH:mm (ex: 08:00 ou 17:30)",
        ),
      intervaloMinutos: z.coerce
        .number()
        .int("O intervalo deve ser um número inteiro")
        .min(5, "Mínimo de 5 minutos")
        .max(60, "Máximo de 60 minutos"),
    })
    .refine(
      // Validando se horaFim é maior que horaInicio
      (dados) => {
        return dados.horaFim > dados.horaInicio;
      },
      {
        message: "O horário de término deve ser posterior ao horário de início",
        path: ["horaFim"],
      },
    );

  // FAZENDO A VALIDAÇÃO
  const resultado = medicoSchema.safeParse(req.body);

  // VERIFICANDO SE DEU CERTO
  if (!resultado.success) {
    return next(
      criarErro(resultado.error.issues[0].message || "Dados inválidos", 400),
    );
  }

  // ARMAZENANDO OS DADOS NA VARIÁVEL dados
  const dados = resultado.data;

  // VALIDANDO EXISTENCIA DO MÉDICO, EMAIL E CRM
  try {
    // 1. Verifica se OUTRO usuário já usa esse email
    const emailExistente = await db.query(
      "SELECT id_usuario FROM usuario WHERE email_usuario = $1 AND id_usuario != $2",
      [dados.email, idUsuarioMedico],
    );
    if (emailExistente.rows.length > 0) {
      return next(criarErro("Email já cadastrado por outro usuário", 400));
    }

    // 2. Verifica se OUTRO médico já usa esse CRM
    const crmExistente = await db.query(
      "SELECT id_medico FROM medico WHERE crm = $1 AND id_medico != $2",
      [dados.CRM, idMedico],
    );
    if (crmExistente.rows.length > 0) {
      return next(criarErro("CRM já cadastrado por outro médico", 400));
    }
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }

  // CASO NÃO MANDAR A SENHA, A NOVA SENHA VAI SER IGUAL A ANTIGA
  const senhaEncriptada = dados.senha
    ? await bcrypt.hash(dados.senha, 10)
    : null;

  // MANDANDO A FOTO PARA O CLOUDINARY
  let fotoUrl = null;
  if (req.file) {
    const fotoResult = await enviarParaCloudinary(
      req.file.buffer,
      idUsuarioMedico,
      "medicos",
    );
    fotoUrl = fotoResult.secure_url;
  }

  // ATUALIZANDO MÉDICO NO BANCO DE DADOS
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // FAZENDO UPDATE NA TABELA medico
    await client.query(
      "UPDATE medico SET crm = $1, sobre_medico = $2, valor_consulta = $3 WHERE id_medico = $4",
      [dados.CRM, dados.sobre, dados.valorConsulta, idMedico],
    );

    // FAZENDO UPDATE NA TABELA usuario
    await client.query(
      "UPDATE usuario SET nome_usuario = $1, email_usuario = $2, senha_usuario = COALESCE($3, senha_usuario), telefone_usuario = $4, foto_url = COALESCE($5, foto_url) WHERE id_usuario = $6",
      [
        dados.nome,
        dados.email,
        senhaEncriptada,
        dados.telefone,
        fotoUrl,
        idUsuarioMedico,
      ],
    );

    // PREPARANDO PARA FAZER INSERT DE
    // NOVOS HORÁRIOS NA TABELA horario_medico
    await client.query("DELETE FROM horario_medico WHERE id_medico = $1", [
      idMedico,
    ]);

    // FAZENDO O INSERT NA TABELA horario_medico
    for (const element of dados.diasAtendimento) {
      await client.query(
        "INSERT INTO horario_medico (id_medico, dia_semana, hora_inicio, hora_fim, intervalo_minutos) VALUES ($1, $2, $3, $4, $5)",
        [
          idMedico,
          element,
          dados.horaInicio,
          dados.horaFim,
          dados.intervaloMinutos,
        ],
      );
    }

    // PREPARANDO PARA FAZER INSERT DE
    // ESPECIALIDADES NA TABELA medico_especialidade
    await client.query(
      "DELETE FROM medico_especialidade WHERE id_medico = $1",
      [idMedico],
    );

    // FAZENDO O INSERT NA TABELA medico_especialidade
    for (const id of dados.especialidade) {
      await client.query(
        "INSERT INTO medico_especialidade (id_medico, id_especialidade) VALUES ($1, $2)",
        [idMedico, id],
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Médico atualizado com sucesso" });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(criarErro("Erro interno do servidor", 500));
  } finally {
    client.release();
  }
};;

export const inativarMedico = async (req, res, next) => {
  const idMedico = req.params.id;
  try {
    const idUsuario = await db.query(
      "SELECT id_usuario FROM medico WHERE id_medico = $1",
      [idMedico],
    );

    if (idUsuario.rows.length === 0) {
      return next(criarErro("Médico não encontrado", 404));
    }

    await db.query(
      "UPDATE medico SET status_medico = 'INATIVO' WHERE id_medico = $1",
      [idMedico],
    );

    res.status(200).json({ message: "Médico inativado com sucesso" });
  } catch (error) {
    return next(
      criarErro(error.message || "Não foi possível inativar o médico", 500),
    );
  }
};

export const especialidades = async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM especialidade");
    res.status(200).json(result.rows);
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }
};
