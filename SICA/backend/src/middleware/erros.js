import multer from "multer";

const errorHandler = (err, req, res, next) => {

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      erro: "A imagem não pode ultrapassar 5 MB.",
    });
  }

  if (err instanceof multer.MulterError) {
    const mensagens = {
      LIMIT_FILE_SIZE: "O arquivo não pode ultrapassar 5 MB.",
      LIMIT_FILE_COUNT: "Quantidade máxima de arquivos excedida.",
      LIMIT_FIELD_KEY: "Nome de campo muito longo.",
      LIMIT_FIELD_VALUE: "Valor de campo muito longo.",
      LIMIT_FIELD_COUNT: "Quantidade máxima de campos excedida.",
      LIMIT_PART_COUNT: "Quantidade máxima de partes excedida.",
      LIMIT_UNEXPECTED_FILE: "Arquivo enviado em um campo não permitido.",
    };

    return res.status(400).json({
      erro: mensagens[err.code] || "Erro ao processar arquivo.",
    });
  }

  if (err.status) {
    res.status(err.status).json({erro: err.message});
  } else {
     res.status(500).json({erro: "Erro Interno Do Servidor"})
  }

}

export default errorHandler;