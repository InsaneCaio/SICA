import criarErro from "../utils/criarErro.js";

export function autorizar(...tiposUsuarios) {
  return (req, res, next) => {

    if (!req.usuario) {
      next(criarErro("Não autenticado", 401));
    }

    if (!tiposUsuarios.includes(req.usuario.tipo)) {
      next(criarErro("Acesso negado", 403));
    }

    next();
  }
}