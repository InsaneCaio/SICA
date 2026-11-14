import z from "zod";
import bcrypt from 'bcrypt';

import upload from "../middleware/imgUpload.js";
import { enviarParaCloudinary } from "../utils/enviarParaCloudinary.js";
import db from "../config/database.js";
import criarErro from "../utils/criarErro.js";

export const listarTodosMedicos = (req, res, next) => {
  res.status(200).json({ message: "[Rota listarTodosMedicos Funcionando]" });
};

export const listarMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota listarMedico Funcionando]" });
};

export const criarMedico = async (req, res, next) => {
  const userId = req.usuario.id;

  // Validações
  const DiaSemanaEnum = z.enum([
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
  ]);

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
      sobre: z.string().trim(),
      CRM: z
        .string()
        .min(1, "CRM Obrigatório")
        .regex(/^\d{4,7}\s*[-/]?\s*[A-Za-z]{2}$/, "CRM inválido"),
      especialidade: z.string().min(1, "Especialidade Obrigatória"),
      valorConsulta: z.coerce
        .number()
        .positive("O valor da consulta deve ser positivo")
        .optional(),
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

  const resultado = medicoSchema.safeParse(req.body);

  if (!resultado.success) {
    return next(
      criarErro(resultado.error.issues[0].message || "Dados inválidos", 400),
    );
  }

  const dados = resultado.data;

  if (!req.file) {
    return next(criarErro("Nenhuma foto enviada", 400));
  }

  // verificando email e CRM
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
    return next(criarErro());
  }

  // Mandar a foto para o cloudinary
  const fotoResult = await enviarParaCloudinary(
    req.file.buffer,
    userId,
    "medicos",
  );
  const fotoUrl = fotoResult.secure_url;

  // encriptando a senha
  const senhaEncriptada = await bcrypt.hash(dados.senha, 10);

  // armazenando no banco de dados
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      'INSERT INTO usuario (tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, foto_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario AS "idUsuario"',
      [
        "MEDICO",
        dados.nome,
        dados.email,
        senhaEncriptada,
        dados.telefone,
        fotoUrl,
      ],
    );

    const idUsuario = userRes.rows[0].idUsuario;

    const userRes2 = await client.query(
      'INSERT INTO medico (crm, id_usuario, especialidade_medico, sobre_medico, valor_consulta) VALUES ($1, $2, $3, $4, $5) RETURNING id_medico AS "idMedico"',
      [
        dados.CRM,
        idUsuario,
        Array.isArray(dados.especialidade)
          ? dados.especialidade
          : [dados.especialidade],
        dados.sobre,
        dados.valorConsulta,
      ],
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

    await client.query("COMMIT");

    res.status(201).json({ message: "Médico cadastrado com sucesso" });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(criarErro(error.message || "Erro interno do servidor", 500));
  } finally {
    client.release();
  }
};;

export const editarMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota editarMedico Funcionando]" });
};

// Decidindo se vamos implementar isso
// export const editarMedicoPatch = (req, res, next) => {}

export const excluirMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota excluirMedico Funcionando]" });
};
