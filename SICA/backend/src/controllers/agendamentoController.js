import z from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";

import db from "../config/database.js";
import criarErro from "../utils/criarErro.js";

export const listarConsultas = async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM vw_consultas");

    res.status(200).json(rows);
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }
};

export const listarConsulta = async (req, res, next) => {
  const idConsulta = req.params.id;

  try {
    const { rows } = await db.query(
      "SELECT * FROM vw_consultas WHERE id_consulta = $1",
      [idConsulta],
    );

    if (rows.length === 0)
      return next(criarErro("Consulta não encontrada", 404));

    res.status(200).json(rows);
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }
};

export const criarConsulta = async (req, res, next) => {
  // VALIDAÇÃO ZOD
  const pacienteSchema = z.object({
    cpf: z
      .string()
      .transform((val) => val.replace(/\D/g, "")) // "123.456.789-00" → "12345678900"
      .refine((val) => val.length === 11, "O CPF deve conter 11 dígitos"),
    nome: z
      .string()
      .min(1, "Nome obrigatório")
      .max(100, "Nome não pode exceder 100 caracteres"),
    dataNascimento: z
      .string()
      // 1. Valida o formato de ENTRADA (DD/MM/AAAA) — antes de transformar
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de data inválido (DD/MM/AAAA)")
      // 2. Converte para YYYY-MM-DD
      .transform((val) => {
        const [dia, mes, ano] = val.split("/");
        return `${ano}-${mes}-${dia}`;
      })
      // 3. A partir daqui val já é YYYY-MM-DD
      .refine((val) => {
        const data = new Date(val + "T00:00:00");
        return !isNaN(data.getTime());
      }, "Data de nascimento inválida")
      .refine((val) => {
        return new Date(val + "T00:00:00") < new Date();
      }, "Data de nascimento não pode ser no futuro")
      .refine((val) => {
        return new Date(val + "T00:00:00") >= new Date("1900-01-01");
      }, "Data de nascimento inválida"),
    telefone: z
      .string()
      .transform((val) => val.replace(/\D/g, "")) // "(15) 99862-3200" → "15998623200"
      .refine(
        (val) => val.length >= 10 && val.length <= 11,
        "Telefone inválido",
      ),
    email: z.email("E-mail inválido").toLowerCase(),
  });
  const consultaSchema = z.object({
    idMedico: z.number().int().positive("ID do médico inválido"),
    dataInicio: z
      .string()
      .datetime({ local: true, message: "Data e horário inválidos" }),
    paciente: pacienteSchema,
  });

  // VALIDANDO OS DADOS ENVIADOS
  const resultado = consultaSchema.safeParse(req.body);

  // VERIFICA SE DEU CERTO
  if (!resultado.success)
    return next(criarErro(resultado.error.issues[0].message, 400));

  // ARMAZENA OS DADOS NA VARIÁVEL DADOS
  const dados = resultado.data;

  // VALIDAÇÕES DE CPF E HORÁRIO
  let regraDia;
  try {
    // VALIDANDO SE CPF É VALIDO

    const cpfValido = await db.query("SELECT validar_cpf($1) AS valido", [
      dados.paciente.cpf,
    ]);

    if (!cpfValido.rows[0].valido) return next(criarErro("CPF inválido", 400));

    // VALIDANDO SE A DATA REALMENTE ESTÁ LIVRE PARA O MÉDICO
    const dataInicio = new Date(dados.dataInicio);

    // 1. Busca a regra de horário do médico para o dia da semana
    const DIAS = [
      "DOMINGO",
      "SEGUNDA",
      "TERCA",
      "QUARTA",
      "QUINTA",
      "SEXTA",
      "SABADO",
    ];
    const nomeDia = DIAS[dataInicio.getDay()];

    const { rows } = await db.query(
      "SELECT * FROM horario_medico WHERE id_medico = $1 AND dia_semana = $2",
      [dados.idMedico, nomeDia],
    );

    if (rows.length === 0) {
      return next(criarErro("Médico não atende nesse dia", 400));
    }

    // 2. Verifica se o horário bate com um slot válido
    // ADICIONE — verifica se o slot cabe em QUALQUER bloco (manhã OU tarde):
    const horaSlot = dataInicio.getHours() * 60 + dataInicio.getMinutes();

    const slotValido = rows.some((bloco) => {
      const [hIni, mIni] = bloco.hora_inicio.split(":").map(Number);
      const [hFim, mFim] = bloco.hora_fim.split(":").map(Number);
      const inicioMin = hIni * 60 + mIni;
      const fimMin = hFim * 60 + mFim;
      const passo = bloco.duracao_minutos + (bloco.intervalo_minutos || 0);

      return (
        horaSlot >= inicioMin &&
        horaSlot < fimMin &&
        (horaSlot - inicioMin) % passo === 0
      );
    });

    if (!slotValido) {
      return next(criarErro("Horário inválido para este médico", 400));
    }

    // Pega o bloco que contém o slot (para usar duracao_minutos abaixo)
    regraDia = rows.find((bloco) => {
      const [hIni, mIni] = bloco.hora_inicio.split(":").map(Number);
      const [hFim, mFim] = bloco.hora_fim.split(":").map(Number);
      const inicioMin = hIni * 60 + mIni;
      const fimMin = hFim * 60 + mFim;
      return horaSlot >= inicioMin && horaSlot < fimMin;
    });
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }

  // LÓGICA DO BANCO
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    let idPaciente;

    // VAMOS VERIFICAR SE O PACIENTE JÁ EXISTE
    const pacienteExistente = await client.query(
      `SELECT p.id_paciente, p.id_usuario FROM paciente p WHERE p.cpf_paciente = $1`,
      [dados.paciente.cpf],
    );

    if (pacienteExistente.rows.length > 0) {
      idPaciente = pacienteExistente.rows[0].id_paciente;
    } else {
      // SE NÃO EXISTIR VAMOS VER SE ELE JÁ
      // É UM USUÁRIO DO SISTEMA
      const usuarioExistente = await client.query(
        "SELECT id_usuario FROM usuario WHERE email_usuario = $1",
        [dados.paciente.email],
      );

      if (usuarioExistente.rows.length > 0) {
        const idUsuario = usuarioExistente.rows[0].id_usuario;

        const resPaciente = await client.query(
          "INSERT INTO paciente (id_usuario, cpf_paciente, data_nascimento_paciente, conta_ativada) VALUES ($1, $2, $3, TRUE) RETURNING id_paciente",
          [idUsuario, dados.paciente.cpf, dados.paciente.dataNascimento],
        );

        idPaciente = resPaciente.rows[0].id_paciente;
      } else {
        // // VERIFICANDO SE EMAIL JÁ EXISTE
        // const { rows } = await client.query(
        //   "SELECT email_usuario FROM usuario WHERE email_usuario = $1",
        //   [dados.paciente.email],
        // );

        // if (rows.length > 0) {
        //   await client.query("ROLLBACK");
        //   return next(criarErro("Email já cadastrado por outro usuário", 400));
        // }
        const senhaAleatoria = crypto.randomBytes(8).toString("hex");
        const senhaEncriptada = await bcrypt.hash(senhaAleatoria, 10);

        const resUsuario = await client.query(
          "INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario, telefone_usuario) VALUES ($1, $2, $3, $4) RETURNING id_usuario",
          [
            dados.paciente.nome,
            dados.paciente.email,
            senhaEncriptada,
            dados.paciente.telefone,
          ],
        );

        const idUsuarioPaciente = resUsuario.rows[0].id_usuario;

        const resPaciente = await client.query(
          "INSERT INTO paciente (id_usuario, cpf_paciente, data_nascimento_paciente, conta_ativada) VALUES ($1, $2, $3, FALSE) RETURNING id_paciente",
          [
            idUsuarioPaciente,
            dados.paciente.cpf,
            dados.paciente.dataNascimento,
          ],
        );

        idPaciente = resPaciente.rows[0].id_paciente;
      }
    }

    // PEGANDO O VALOR DA CONSULTA DO MÉDICO
    const resMedico = await client.query(
      "SELECT valor_consulta FROM medico WHERE id_medico = $1",
      [dados.idMedico],
    );

    const valorConsulta = resMedico.rows[0].valor_consulta;

    // CALCULANDO A DATA FINAL DA CONSULTA
    const dataFim = new Date(dados.dataInicio);
    dataFim.setMinutes(dataFim.getMinutes() + regraDia.duracao_minutos);

    // Formata como string local (YYYY-MM-DDTHH:mm:ss) para não somar 3h de UTC
    const ano = dataFim.getFullYear();
    const mes = String(dataFim.getMonth() + 1).padStart(2, "0");
    const dia = String(dataFim.getDate()).padStart(2, "0");
    const hora = String(dataFim.getHours()).padStart(2, "0");
    const min = String(dataFim.getMinutes()).padStart(2, "0");
    const dataFimFormatada = `${ano}-${mes}-${dia}T${hora}:${min}:00`;

    // CRIANDO A CONSULTA
    await client.query(
      "INSERT INTO consulta (id_paciente, id_medico, data_inicio_consulta, data_fim_consulta, valor_pago, status_consulta) VALUES ($1, $2, $3, $4, $5, 'AGENDADA')",
      [idPaciente, dados.idMedico, dados.dataInicio, dataFimFormatada, valorConsulta],
    );

    await client.query("COMMIT");
    res.status(201).json({ mensagem: "Consulta agendada com sucesso" });
  } catch (error) {
    await client.query("ROLLBACK");

    // O banco tem a constraint 'no_overlapping_consultas' (GIST)
    // Se duas recepcionistas tentarem agendar o mesmo horário no mesmo segundo:
    if (error.code === "23P01") {
      // código PostgreSQL para exclusion_violation
      return next(
        criarErro(
          "Este horário acabou de ser ocupado por outro agendamento",
          409,
        ),
      );
    }

    return next(criarErro("Erro interno do servidor", 500));
  } finally {
    client.release();
  }
};

export const editarStatusConsulta = async (req, res, next) => {
  const idConsulta = req.params.id;

  const statusSchema = z.object({
    status: z.enum(
      ["AGENDADA", "CONFIRMADA", "CONCLUIDA", "CANCELADA", "NAO_COMPARECEU"],
      "Status inválido",
    ),
  });

  const resultado = statusSchema.safeParse(req.body);

  if (!resultado.success)
    return next(criarErro(resultado.error.issues[0].message, 400));

  const dados = resultado.data;

  try {
    const { rows } = await db.query(
      "SELECT id_consulta FROM consulta WHERE id_consulta = $1",
      [idConsulta],
    );

    if (rows.length === 0)
      return next(criarErro("Consulta não encontrada", 404));
    else {
      await db.query(
        "UPDATE consulta SET status_consulta = $1 WHERE id_consulta = $2",
        [dados.status, idConsulta],
      );

      res.status(200).json({ mensagem: "Status alterado com sucesso" });
    }
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }
};

export const reagendarConsulta = async (req, res, next) => {
  const idConsulta = req.params.id;

  const reagendarSchema = z.object({
    idMedico: z.number().int().positive("ID do médico inválido"),
    dataNova: z
      .string()
      .datetime({ local: true, message: "Data e horário inválidos" }),
  });

  const resultado = reagendarSchema.safeParse(req.body);

  if (!resultado.success)
    return next(criarErro(resultado.error.issues[0].message, 400));

  const dataReagendar = resultado.data.dataNova;
  const idMedico = resultado.data.idMedico;

  // VENDO SE MEDICO E CONSULTA EXISTE
  try {
    const medicoRes = await db.query("SELECT id_medico FROM medico WHERE id_medico = $1", [idMedico]);

    if (!medicoRes.rows[0].length === 0) return next(criarErro("Médico não encontrado", 404));

    const { rows } = await db.query(
      "SELECT id_consulta FROM consulta WHERE id_consulta = $1",
      [idConsulta],
    );
    if (rows.length === 0)
      return next(criarErro("Consulta não encontrada", 404));
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }

  // VALIDAÇÕES DE HORÁRIO
  let regraDia;
  try {
    // VALIDANDO SE A DATA REALMENTE ESTÁ LIVRE PARA O MÉDICO
    const dataInicio = new Date(dataReagendar);

    // 1. Busca a regra de horário do médico para o dia da semana
    const DIAS = [
      "DOMINGO",
      "SEGUNDA",
      "TERCA",
      "QUARTA",
      "QUINTA",
      "SEXTA",
      "SABADO",
    ];
    const nomeDia = DIAS[dataInicio.getDay()];

    const { rows } = await db.query(
      "SELECT * FROM horario_medico WHERE id_medico = $1 AND dia_semana = $2",
      [idMedico, nomeDia],
    );

    if (rows.length === 0) {
      return next(criarErro("Médico não atende nesse dia", 400));
    }

    // 2. Verifica se o horário bate com um slot válido
    // ADICIONE — verifica se o slot cabe em QUALQUER bloco (manhã OU tarde):
    const horaSlot = dataInicio.getHours() * 60 + dataInicio.getMinutes();

    const slotValido = rows.some((bloco) => {
      const [hIni, mIni] = bloco.hora_inicio.split(":").map(Number);
      const [hFim, mFim] = bloco.hora_fim.split(":").map(Number);
      const inicioMin = hIni * 60 + mIni;
      const fimMin = hFim * 60 + mFim;
      const passo = bloco.duracao_minutos + (bloco.intervalo_minutos || 0);

      return (
        horaSlot >= inicioMin &&
        horaSlot < fimMin &&
        (horaSlot - inicioMin) % passo === 0
      );
    });

    if (!slotValido) {
      return next(criarErro("Horário inválido para este médico", 400));
    }

    // Pega o bloco que contém o slot (para usar duracao_minutos abaixo)
    regraDia = rows.find((bloco) => {
      const [hIni, mIni] = bloco.hora_inicio.split(":").map(Number);
      const [hFim, mFim] = bloco.hora_fim.split(":").map(Number);
      const inicioMin = hIni * 60 + mIni;
      const fimMin = hFim * 60 + mFim;
      return horaSlot >= inicioMin && horaSlot < fimMin;
    });
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }

  try {
    // CALCULANDO A DATA FINAL DA CONSULTA
    const dataFim = new Date(dataReagendar);
    dataFim.setMinutes(dataFim.getMinutes() + regraDia.duracao_minutos);

    // Formata como string local (YYYY-MM-DDTHH:mm:ss)
    const ano = dataFim.getFullYear();
    const mes = String(dataFim.getMonth() + 1).padStart(2, "0");
    const dia = String(dataFim.getDate()).padStart(2, "0");
    const hora = String(dataFim.getHours()).padStart(2, "0");
    const min = String(dataFim.getMinutes()).padStart(2, "0");
    const dataFimFormatada = `${ano}-${mes}-${dia}T${hora}:${min}:00`;

    await db.query(
      "UPDATE consulta SET data_inicio_consulta = $1, data_fim_consulta = $2 WHERE id_consulta = $3 AND id_medico = $4",
      [dataReagendar, dataFimFormatada, idConsulta, idMedico],
    );

    res.status(200).json({ message: "Consulta reagendada com sucesso" });
  } catch (error) {

    if (error.code === "23P01") {
      // código PostgreSQL para exclusion_violation
      return next(
        criarErro(
          "Este horário acabou de ser ocupado por outro agendamento",
          409,
        ),
      );
    }

    return next(criarErro("Erro interno do servidor", 500));
  }
};
