import Router from "express";
import {
  criarConsulta,
  editarStatusConsulta,
  listarConsulta,
  listarConsultas,
  reagendarConsulta,
} from "../controllers/agendamentoController.js";
import { autenticar } from "../middleware/autenticacao.js";
import { autorizar } from "../middleware/autorizacao.js";

const router = Router();

// LISTAR TODAS AS CONSULTAS
router.get(
  "/",
  autenticar,
  autorizar("ADMIN", "FUNCIONARIO", "PACIENTE", "MEDICO"),
  listarConsultas,
);

// LISTAR SOMENTE UMA CONSULTA
router.get(
  "/:id",
  autenticar,
  autorizar("ADMIN", "FUNCIONARIO", "PACIENTE", "MEDICO"),
  listarConsulta,
);

// CRIAR/MARCAR CONSULTA
router.post(
  "/",
  autenticar,
  autorizar("ADMIN", "FUNCIONARIO", "PACIENTE", "MEDICO"),
  criarConsulta,
);

// ALTERAR STATUS CONSULTA
router.patch(
  "/:id",
  autenticar,
  autorizar("ADMIN", "FUNCIONARIO", "PACIENTE", "MEDICO"),
  editarStatusConsulta,
);

// REAGENDAR CONSULTA
router.put(
  "/:id",
  autenticar,
  autorizar("ADMIN", "FUNCIONARIO", "PACIENTE", "MEDICO"),
  reagendarConsulta,
);

export default router;
