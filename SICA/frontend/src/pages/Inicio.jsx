import { useCallback, useEffect, useRef, useState } from "react";
import { obterNomeUsuario, podeAcessarAgenda } from "../services/servicoAutenticacao";
import { consultarAgenda } from "../services/servicoAgenda";
import { ListaAgenda } from "./agenda/ComponentesAgenda";
import LinhaConsulta from "./agenda/LinhaConsulta";
import { dataLocal, instanteConsulta } from "./agenda/datas";
import "./Inicio.css";

const situacoes = {
    AGENDADA: "Ainda não chegou",
    CONFIRMADA: "Aguardando atendimento",
    CONCLUIDA: "Consulta concluída",
};

function ConsultasHoje() {
    const [dia, definirDia] = useState(dataLocal);
    const [consultas, definirConsultas] = useState([]);
    const [carregando, carregar] = useState(true);
    const [erro, definirErro] = useState("");
    const [erroSituacao, definirErroSituacao] = useState("");
    const [salvando, definirSalvando] = useState(null);
    const versao = useRef({ pedido: 0 });
    const emAlteracao = useRef(false);
    const atualizar = useCallback(async () => {
        const hoje = dataLocal();
        definirDia(hoje);
        if (emAlteracao.current) return;
        const pedido = ++versao.current.pedido;
        try {
            const lista = await consultarAgenda("/agendamento");
            if (pedido !== versao.current.pedido) return;
            definirConsultas(
                lista
                    .filter(
                        (c) =>
                            c.status_consulta !== "CANCELADA" &&
                            dataLocal(instanteConsulta(c.data_inicio_consulta)) === hoje,
                    )
                    .sort(
                        (a, b) =>
                            instanteConsulta(a.data_inicio_consulta) -
                            instanteConsulta(b.data_inicio_consulta),
                    ),
            );
            definirErro("");
        } catch (e) {
            if (pedido === versao.current.pedido) definirErro(e.message);
        } finally {
            if (pedido === versao.current.pedido) carregar(false);
        }
    }, [versao]);

    useEffect(() => {
        const controle = versao.current;
        const inicial = setTimeout(atualizar, 0);
        const intervalo = setInterval(atualizar, 15000);
        window.addEventListener("focus", atualizar);
        return () => {
            controle.pedido++;
            clearTimeout(inicial);
            clearInterval(intervalo);
            window.removeEventListener("focus", atualizar);
        };
    }, [atualizar, versao]);

    useEffect(() => {
        const amanha = new Date();
        amanha.setHours(24, 0, 0, 0);
        const virada = setTimeout(atualizar, Math.max(0, amanha.getTime() - Date.now()));
        return () => clearTimeout(virada);
    }, [dia, atualizar]);

    async function alterarSituacao(id, status) {
        if (emAlteracao.current) return;
        emAlteracao.current = true;
        versao.current.pedido++;
        definirSalvando(id);
        definirErroSituacao("");
        try {
            await consultarAgenda("/agendamento/" + id, "PATCH", { status });
            definirConsultas((lista) =>
                lista.map((c) => (c.id_consulta === id ? { ...c, status_consulta: status } : c)),
            );
        } catch (e) {
            definirErroSituacao(e.message);
        } finally {
            emAlteracao.current = false;
            definirSalvando(null);
            void atualizar();
        }
    }
    return (
        <>
            <h2 className="titulo-secao">Consultas de hoje · {dia.split("-").reverse().join("/")}</h2>
            {(erro || erroSituacao) && (
                <p role="alert" className="aviso-medicos erro-medicos">
                    {erroSituacao || erro}
                </p>
            )}
            <ListaAgenda
                key={dia}
                itens={consultas.filter((c) => dataLocal(instanteConsulta(c.data_inicio_consulta)) === dia)}
                colunas={["Horário", "Nome do paciente", "Médico", "Situação"]}
                filtrar={(c) => c.nome_paciente + " " + c.nome_medico}
                dica="Digite o nome do paciente ou do médico..."
                vazio="Nenhuma consulta encontrada para hoje."
                carregando={carregando}
                falhou={!!erro}
                linha={(c) => (
                    <LinhaConsulta key={c.id_consulta} consulta={c}>
                        <select
                            aria-label={"Situação de " + c.nome_paciente}
                            value={c.status_consulta}
                            className={
                                "situacao-consulta " +
                                ({ CONFIRMADA: "presente", CONCLUIDA: "concluida" }[c.status_consulta] ||
                                    "ausente")
                            }
                            disabled={salvando !== null}
                            onChange={(e) => alterarSituacao(c.id_consulta, e.target.value)}
                        >
                            {!situacoes[c.status_consulta] && (
                                <option value={c.status_consulta}>
                                    {c.status_consulta === "NAO_COMPARECEU"
                                        ? "Não compareceu"
                                        : c.status_consulta}
                                </option>
                            )}
                            {Object.entries(situacoes).map(([valor, texto]) => (
                                <option key={valor} value={valor}>
                                    {texto}
                                </option>
                            ))}
                        </select>
                    </LinhaConsulta>
                )}
            />
        </>
    );
}

export default function Inicio() {
    return (
        <main className="conteudo pagina-inicio">
            <section className="boas-vindas">
                <h1>Bem-vindo(a), {obterNomeUsuario()}</h1>
            </section>
            {podeAcessarAgenda() && <ConsultasHoje />}
        </main>
    );
}
