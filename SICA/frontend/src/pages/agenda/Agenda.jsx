import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { consultarAgenda } from "../../services/servicoAgenda";
import { Dias, ListaAgenda } from "./ComponentesAgenda";
import { dataLocal, formatarDia, horaConsulta, instanteConsulta } from "./datas";

export default function Agenda() {
    const { state } = useLocation();
    const [data, definirData] = useState(state?.data || dataLocal());
    const [consultas, definirConsultas] = useState([]);
    const [erro, definirErro] = useState("");
    const [mensagem, definirMensagem] = useState(state?.mensagem || "");
    const [carregando, carregar] = useState(true);
    const [cancelando, cancelar] = useState(false);

    useEffect(() => {
        let ativo = true;
        consultarAgenda("/agendamento")
            .then((lista) => {
                if (ativo)
                    definirConsultas(
                        lista
                            .filter((c) => c.status_consulta !== "CANCELADA")
                            .sort(
                                (a, b) =>
                                    instanteConsulta(a.data_inicio_consulta) -
                                    instanteConsulta(b.data_inicio_consulta),
                            ),
                    );
            })
            .catch((e) => {
                if (ativo) definirErro(e.message);
            })
            .finally(() => {
                if (ativo) carregar(false);
            });
        return () => {
            ativo = false;
        };
    }, []);

    async function cancelarConsulta(consulta) {
        if (
            !window.confirm(
                "Cancelar a consulta de " +
                    consulta.nome_paciente +
                    " às " +
                    horaConsulta(consulta.data_inicio_consulta) +
                    "?",
            )
        )
            return;
        cancelar(true);
        definirErro("");
        definirMensagem("");
        try {
            await consultarAgenda("/agendamento/" + consulta.id_consulta, "PATCH", { status: "CANCELADA" });
            definirConsultas((lista) => lista.filter((c) => c.id_consulta !== consulta.id_consulta));
            definirMensagem("Consulta cancelada.");
        } catch (e) {
            definirErro(e.message);
        } finally {
            cancelar(false);
        }
    }

    const totais = {};
    const doDia = consultas.filter((c) => dataLocal(instanteConsulta(c.data_inicio_consulta)) === data);
    for (const consulta of consultas) {
        const dia = dataLocal(instanteConsulta(consulta.data_inicio_consulta));
        totais[dia] = (totais[dia] || 0) + 1;
    }
    return (
        <main className="conteudo pagina-medicos pagina-agenda">
            <header className="topo-medicos topo-agenda">
                <div>
                    <small>Agenda Geral</small>
                    <h1>
                        {formatarDia(data, { day: "2-digit", month: "long" })
                            .replace(" de ", " ")
                            .toUpperCase()}
                    </h1>
                </div>
                <Link className="botao-novo-medico" to="/agenda/novo">
                    <UserPlus size={16} /> Criar Novo Agendamento
                </Link>
            </header>
            <Dias data={data} alterar={definirData} quantidades={totais} unidade="consulta" />
            {erro && (
                <p role="alert" className="aviso-medicos erro-medicos">
                    {erro}
                </p>
            )}
            {mensagem && (
                <p role="status" className="aviso-medicos sucesso-medicos">
                    {mensagem}
                </p>
            )}
            <ListaAgenda
                key={data}
                itens={doDia}
                colunas={["Horário", "Nome do paciente", "Médico", "Ações"]}
                filtrar={(c) => c.nome_paciente}
                dica="Digite o nome do paciente"
                vazio="Nenhuma consulta encontrada."
                carregando={carregando}
                falhou={!!erro}
                linha={(c) => (
                    <tr key={c.id_consulta}>
                        <td>{horaConsulta(c.data_inicio_consulta)}</td>
                        <td>{c.nome_paciente}</td>
                        <td>{c.nome_medico}</td>
                        <td>
                            <div className="acoes-medico">
                                <Link
                                    className="acao-medico"
                                    to={"/agenda/" + c.id_consulta + "/reagendar"}
                                    aria-label={"Reagendar consulta de " + c.nome_paciente}
                                >
                                    <Pencil size={15} />
                                </Link>
                                <button
                                    className="acao-medico acao-inativar"
                                    disabled={cancelando}
                                    onClick={() => cancelarConsulta(c)}
                                    aria-label={"Cancelar consulta de " + c.nome_paciente}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </td>
                    </tr>
                )}
            />
        </main>
    );
}
