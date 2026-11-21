import Router from 'express';
import upload from '../middleware/imgUpload.js';
import { listarTodosMedicos, listarMedico, criarMedico, editarMedico, inativarMedico, especialidades } from '../controllers/medicoController.js';
import { autenticar } from '../middleware/autenticacao.js';
import { autorizar } from '../middleware/autorizacao.js';

const router = Router();

router.get("/", autenticar, autorizar('ADMIN'), listarTodosMedicos);

router.get('/especialidades', especialidades);

router.get("/:id", autenticar, autorizar('ADMIN'), listarMedico);

router.post("/", autenticar, autorizar('ADMIN'), upload.single('foto'),  criarMedico);

router.put("/:id", autenticar, autorizar('ADMIN'), upload.single("foto"), editarMedico);

router.delete("/:id", autenticar, autorizar('ADMIN'), inativarMedico);


export default router;