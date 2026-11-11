import Router from 'express';

import { listarTodosMedicos, listarMedico, criarMedico, editarMedico, excluirMedico } from '../controllers/medicoController.js';

const router = Router();

router.get('/', /*função autenticar*/ listarTodosMedicos);

router.get("/:id", /*função autenticar*/  listarMedico);

router.post("/", /*função autenticar*/  criarMedico);

router.put("/:id", /*função autenticar*/ editarMedico);

router.delete("/:id", /*função autenticar*/ excluirMedico);

export default router;