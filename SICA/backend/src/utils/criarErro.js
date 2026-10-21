const criarErro = (mensagem = 'Erro Interno do Servidor', status = 500) => {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

export default criarErro;