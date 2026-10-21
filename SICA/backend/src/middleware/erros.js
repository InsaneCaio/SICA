const errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({erro: err.message});
  } else {
     res.status(500).json({erro: "Erro Interno Do Servidor"})
  }
}

export default errorHandler;