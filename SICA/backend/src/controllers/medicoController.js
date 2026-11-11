import z from 'zod';

import db from '../database/db.js';
import criarErro from '../utils/criarErro.js';

export const listarTodosMedicos = (req, res, next) => {
  res.status(200).json({message: "[Rota listarTodosMedicos Funcionando]"});
}

export const listarMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota listarMedico Funcionando]" });
}

export const criarMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota criarMedico Funcionando]" });
}

export const editarMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota editarMedico Funcionando]" });
}

// Decidindo se vamos implementar isso
// export const editarMedicoPatch = (req, res, next) => {}

export const excluirMedico = (req, res, next) => {
  res.status(200).json({ message: "[Rota excluirMedico Funcionando]" });
}