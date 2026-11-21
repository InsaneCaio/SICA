async function requisitarMedicos(caminho, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(`/medico${caminho}`, {
            credentials: "include",
            ...opcoes,
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    const resultado = await resposta.json().catch(() => {
        throw new Error("Resposta inválida do servidor.");
    });

    if (!resposta.ok) {
        throw new Error(resultado.erro || "Não foi possível concluir a solicitação.");
    }

    return resultado;
}

export async function listarMedicos() {
    const resultado = await requisitarMedicos("");

    if (!Array.isArray(resultado)) {
        throw new Error("Lista de médicos inválida.");
    }

    return resultado;
}

export function obterMedico(id) {
    return requisitarMedicos(`/${id}`);
}

export async function listarEspecialidades() {
    const resultado = await requisitarMedicos("/especialidades");

    if (!Array.isArray(resultado)) {
        throw new Error("Lista de especialidades inválida.");
    }

    return resultado;
}

function prepararDados(dados) {
    const formulario = new FormData();

    formulario.append("nome", dados.nome.trim());
    formulario.append("sobre", dados.sobre.trim());
    formulario.append("CRM", dados.crm.trim().toUpperCase());
    formulario.append("especialidade", JSON.stringify(dados.especialidades));
    formulario.append("valorConsulta", dados.valorConsulta);
    formulario.append("email", dados.email.trim().toLowerCase());
    formulario.append("telefone", dados.telefone.trim());
    formulario.append("diasAtendimento", JSON.stringify(dados.diasAtendimento));
    formulario.append("horaInicio", dados.horaInicio);
    formulario.append("horaFim", dados.horaFim);
    formulario.append("intervaloMinutos", String(dados.intervaloMinutos));

    if (dados.senha) {
        formulario.append("senha", dados.senha);
    }

    if (dados.foto) {
        formulario.append("foto", dados.foto);
    }

    return formulario;
}

export function criarMedico(dados) {
    return requisitarMedicos("", {
        method: "POST",
        body: prepararDados(dados),
    });
}

export function editarMedico(id, dados) {
    return requisitarMedicos(`/${id}`, {
        method: "PUT",
        body: prepararDados(dados),
    });
}

export function inativarMedico(id) {
    return requisitarMedicos(`/${id}`, { method: "DELETE" });
}
