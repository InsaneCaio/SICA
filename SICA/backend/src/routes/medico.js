import Router from 'express';
import upload from '../middleware/imgUpload.js';
import { listarTodosMedicos, listarMedico, criarMedico, editarMedico, excluirMedico } from '../controllers/medicoController.js';
import { autenticar } from '../middleware/autenticacao.js';

const router = Router();

router.get("/", autenticar, upload.single("foto"), listarTodosMedicos);

router.get("/:id", autenticar, upload.single("foto"), listarMedico);

router.post("/", autenticar, upload.single('foto'),  criarMedico);

router.put("/:id", autenticar, upload.single("foto"), editarMedico);

router.delete("/:id", autenticar, excluirMedico);

export default router;