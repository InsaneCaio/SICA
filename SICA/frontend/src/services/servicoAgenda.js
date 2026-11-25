export async function consultarAgenda(caminho, metodo = "GET", dados) {
    let resposta;
    try {
        resposta = await fetch(caminho, {
            method: metodo,
            credentials: "include",
            headers: dados && { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    const resultado = await resposta.json();
    if (!resposta.ok) {
        const erro = new Error(resultado.erro || "Não foi possível concluir a solicitação.");
        erro.status = resposta.status;
        throw erro;
    }
    return resultado;
}
