async function enviarRequisicao(rota, dados) {
    let resposta;

    try {
        resposta = await fetch(`/auth/${rota}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(dados),
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor ");
    }

    const resultado = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(resultado.erro || "Não foi possivel concluir a solicitação");
    }

    return resultado;
}

export async function fazerLogin(identificador, senha) {
    const resultado = await enviarRequisicao("login", {
        identificador: identificador.trim(),
        senha,
    });

    sessionStorage.setItem("nome_usuario", resultado.nome || "Usuário");
    return resultado;
}

export function obterNomeUsuario() {
    return sessionStorage.getItem("nome_usuario") || "Usuário";
}

export async function encerrarSessao() {
    await enviarRequisicao("logout", {});
    sessionStorage.removeItem("nome_usuario");
}

export function cadastrarUsuario({ nome, cpf, email, senha }) {
    return enviarRequisicao("signup", {
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ""),
        email: email.trim().toLowerCase(),
        senha,
    });
}
