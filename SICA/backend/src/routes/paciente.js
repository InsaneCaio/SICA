import Router from 'express';
import { buscarPacientePorCPF } from '../controllers/pacienteController.js';
import { autenticar } from '../middleware/autenticacao.js';
import { autorizar } from '../middleware/autorizacao.js';

const router = Router();

router.get('/cpf/:cpf', autenticar, autorizar('ADMIN', 'FUNCIONARIO'), buscarPacientePorCPF);

export default router;