import z from "zod";

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
  
  try {

    const userId = req.usuario.id; // se você tiver middleware de autenticação (JWT)

      if (!req.file) {
        return res.status(400).json({ mensagem: "Nenhuma foto foi enviada." });
      }

      // 1. Envia para o Cloudinary
      const resultado = await enviarParaCloudinary(req.file.buffer, userId);

      // 2. Salva a URL no PostgreSQL
      const fotoUrl = resultado.secure_url;

      await db.query("UPDATE usuario SET foto_url = $1 WHERE id_usuario = $2", [fotoUrl, userId,]);

      return res.status(200).json({
        mensagem: "Foto atualizada com sucesso!",
        foto_url: fotoUrl,
      });

    } catch (error) {
      next(criarErro(error.message || 'Erro interno do servidor', 500));
    }

  // res.status(200).json({ message: "[Rota criarMedico Funcionando]" });

  // const medicoSchema = z.object({
  //   nome: z.string().trim().min(1, "Nome Obrigatório"),
  //   senha: z
  //     .string()
  //     .min(8, "A senha deve ter no mínimo 8 caracteres")
  //     .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula")
  //     .regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula")
  //     .regex(/[0-9]/, "A senha deve ter pelo menos um número")
  //     .regex(
  //       /[^A-Za-z0-9]/,
  //       "A senha deve ter pelo menos um caractere especial",
  //     ),
  //   sobre: z.string().trim(),
  //   CRM: z
  //     .string()
  //     .min(1, "CRM Obrigatório")
  //     .max(8)
  //     .regex(/^\d{4,7}\s*[-/]?\s*[A-Za-z]{2}$/, "CRM inválido"),
  //   especialidade: z.string().min(1, "Especialidade Obrigatória"),
  //   valorConsulta: z.optional(),
  //   email: z.email("E-mail inválido").toLowerCase(),
  //   telefone: z.min(10, "Telefone Obrigatório"),
  // });
};

export const editarMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota editarMedico Funcionando]" });
};

// Decidindo se vamos implementar isso
// export const editarMedicoPatch = (req, res, next) => {}

export const excluirMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota excluirMedico Funcionando]" });
};
