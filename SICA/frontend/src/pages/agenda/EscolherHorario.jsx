import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { consultarAgenda } from "../../services/servicoAgenda";
import { CabecalhoAgenda, Dias } from "./ComponentesAgenda";
import { dataLocal, formatarDia, horaConsulta, instanteConsulta } from "./datas";

export default function EscolherHorario() {
    const { id } = useParams();
    const { state } = useLocation();
    const navegar = useNavigate();
    const medico = state?.medico;
    const [consulta, definirConsulta] = useState(null);
    const [dias, definirDias] = useState([]);
    const [data, definirData] = useState(state?.data || dataLocal());
    const [hora, definirHora] = useState(state?.hora || "");
    const [erro, definirErro] = useState("");
    const [carregando, carregar] = useState(true);
    const [salvando, salvar] = useState(false);
    const [versao, atualizar] = useState(0);
    useEffect(() => {
        let ativo = true;
        async function buscar() {
            let idMedico = medico?.id_medico;
            if (id) {
                const [atual] = await consultarAgenda("/agendamento/" + id);
                if (!atual || atual.status_consulta === "CANCELADA")
                    throw new Error("Consulta indisponível para reagendamento.");
                idMedico = atual.id_medico;
                if (ativo) definirConsulta(atual);
            }
            if (!idMedico) return;
            const vagas = await consultarAgenda("/medico/disponibilidade/" + idMedico);
            if (ativo) {
                definirDias(vagas);
                definirData((anterior) =>
                    vagas.some((d) => d.data === anterior) ? anterior : vagas[0]?.data || dataLocal(),
                );
            }
        }
        buscar()
            .catch((e) => {
                if (ativo) definirErro(e.message);
            })
            .finally(() => {
                if (ativo) carregar(false);
            });
        return () => {
            ativo = false;
        };
    }, [id, medico?.id_medico, versao]);
    if (!id && !medico) return <Navigate to="/agenda/novo" replace />;
    const horarios = dias.find((d) => d.data === data)?.horarios || [];
    const totais = Object.fromEntries(dias.map((d) => [d.data, d.totalVagas]));
    const nomeMedico = consulta?.nome_medico || medico?.nome_usuario;
    async function confirmar() {
        if (!id) {
            navegar("/agenda/novo/paciente", { state: { medico, data, hora } });
            return;
        }
        salvar(true);
        definirErro("");
        try {
            await consultarAgenda("/agendamento/" + id, "PUT", {
                idMedico: consulta.id_medico,
                dataNova: data + "T" + hora + ":00",
            });
            navegar("/agenda", {
                replace: true,
                state: { data, mensagem: "Consulta reagendada com sucesso." },
            });
        } catch (e) {
            definirErro(e.message);
            if (e.status === 409) {
                definirHora("");
                carregar(true);
                atualizar((v) => v + 1);
            }
        } finally {
            salvar(false);
        }
    }
    return (
        <main className="conteudo pagina-medicos pagina-agenda">
            <CabecalhoAgenda
                titulo={id ? "Reagendar Consulta" : "Novo Agendamento"}
                descricao={
                    id
                        ? "Selecione a nova data e horário para o agendamento existente:"
                        : "Selecione a data e o horário da consulta:"
                }
            />
            {consulta && (
                <section className="cartao-agenda">
                    <h2>Agendamento atual</h2>
                    <dl className="resumo-atual">
                        <div>
                            <dt>Paciente</dt>
                            <dd>{consulta.nome_paciente}</dd>
                        </div>
                        <div>
                            <dt>Médico responsável</dt>
                            <dd>{nomeMedico}</dd>
                        </div>
                        <div>
                            <dt>Data e horário atuais</dt>
                            <dd>
                                {instanteConsulta(consulta.data_inicio_consulta).toLocaleDateString("pt-BR")}{" "}
                                às {horaConsulta(consulta.data_inicio_consulta)}
                            </dd>
                        </div>
                    </dl>
                </section>
            )}
            {erro && (
                <p role="alert" className="aviso-medicos erro-medicos">
                    {erro}
                </p>
            )}
            <Dias
                data={data}
                minimo={dataLocal()}
                maximo={dias.at(-1)?.data}
                alterar={(dia) => {
                    definirData(dia);
                    definirHora("");
                }}
                quantidades={totais}
                unidade="vaga"
            />
            <section className="horarios-agenda">
                <header>
                    <strong>
                        Horários · {formatarDia(data, { day: "2-digit", month: "short", year: "numeric" })}
                    </strong>
                    <strong>Ações</strong>
                </header>
                {carregando ? (
                    <p role="status">Carregando horários...</p>
                ) : (
                    horarios.map((h) => (
                        <div key={h} className={h === hora ? "linha-escolhida" : ""}>
                            <span>{h.replace(":", "h")}</span>
                            <button
                                className="azul-agenda"
                                aria-pressed={h === hora}
                                onClick={() => definirHora(h)}
                            >
                                {h === hora ? "Selecionado" : "Selecionar"}
                            </button>
                        </div>
                    ))
                )}
                {!carregando && !horarios.length && <p>Nenhum horário disponível nesta data.</p>}
            </section>
            <footer className="rodape-agenda">
                <Link to={id ? "/agenda" : "/agenda/novo"} state={{ medico }}>
                    Voltar
                </Link>
                <button
                    className="azul-agenda"
                    disabled={!horarios.includes(hora) || carregando || salvando}
                    onClick={confirmar}
                >
                    {id ? "Confirmar Alteração" : "Confirmar Horário"}
                </button>
            </footer>
        </main>
    );
}
