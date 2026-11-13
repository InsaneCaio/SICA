import JWT from "jsonwebtoken";
import criarErro from "../utils/criarErro.js";

export function autenticar(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return next(criarErro("Não Autenticado", 401));
  }
  try {
    const tokenData = JWT.verify(token, process.env.JWT_SECRET);
    req.usuario = tokenData;
    next();
  } catch (error) {
    return next(criarErro("Token Inválido", 401));
  }
}
