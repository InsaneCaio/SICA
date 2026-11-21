import criarErro from "../utils/criarErro.js";

export function autorizar(...papeisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !req.usuario.papeis) {
      return next(criarErro("Não Autenticado", 401));
    }
    const temPermissao = papeisPermitidos.some((papel) =>
      req.usuario.papeis.includes(papel),
    );
    if (!temPermissao) {
      return next(criarErro("Acesso negado: permissão insuficiente", 403));
    }
    next();
  };
}

// export function autorizar(...tiposUsuarios) {
//   return (req, res, next) => {

//     if (!req.usuario) {
//       next(criarErro("Não autenticado", 401));
//     }

//     if (!tiposUsuarios.includes(req.usuario.tipo)) {
//       next(criarErro("Acesso negado", 403));
//     }

//     next();
//   }
// }