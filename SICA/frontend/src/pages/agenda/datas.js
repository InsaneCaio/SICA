export function dataLocal(data = new Date()) {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return [data.getFullYear(), mes, dia].join("-");
}

export function formatarDia(data, opcoes) {
    return new Date(data + "T12:00:00").toLocaleDateString("pt-BR", opcoes);
}

export function instanteConsulta(valor) {
    return new Date(valor.replace(" ", "T"));
}

export function horaConsulta(valor) {
    return instanteConsulta(valor)
        .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        .replace(":", "h");
}

export function diasDaSemana(data) {
    const inicio = new Date(data + "T12:00:00");
    const dia = inicio.getDay();
    inicio.setDate(inicio.getDate() - ((dia + 6) % 7));
    // Inclui o fim de semana quando uma dessas datas está selecionada no calendário.
    return Array.from({ length: dia === 0 || dia === 6 ? 7 : 5 }, (_, indice) => {
        const atual = new Date(inicio);
        atual.setDate(inicio.getDate() + indice);
        return dataLocal(atual);
    });
}
