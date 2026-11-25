import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { consultarAgenda } from "../../services/servicoAgenda";
import { CabecalhoAgenda } from "./ComponentesAgenda";
import { dataLocal, formatarDia } from "./datas";

const camposVazios = { nome: "", dataNascimento: "", telefone: "", email: "" };

function formatarCpf(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
        .replace(/(\.\d{3})(\d)/, "$1-$2");
}

export default function DadosPaciente() {
    const { state } = useLocation();
    const navegar = useNavigate();
    const [cpf, definirCpf] = useState("");
    const [campos, definirCampos] = useState(camposVazios);
    const [cadastro, definirCadastro] = useState(null);
    const [situacao, definirSituacao] = useState("");
    const [erro, definirErro] = useState("");
    const [tentativa, tentar] = useState(0);
    const [salvando, salvar] = useState(false);
    const [ocupado, marcarOcupado] = useState(false);
    const numeros = cpf.replace(/\D/g, "");

    useEffect(() => {
        if (numeros.length !== 11) return;
        let ativo = true;
        consultarAgenda("/paciente/cpf/" + numeros)
            .then((p) => {
                if (!ativo) return;
                definirCadastro(p);
                definirCampos({
                    nome: p.nome || "",
                    dataNascimento: p.data_nascimento?.slice(0, 10) || "",
                    telefone: p.telefone || "",
                    email: p.email || "",
                });
                definirSituacao("existente");
            })
            .catch((e) => {
                if (!ativo) return;
                if (e.status === 404) definirSituacao("novo");
                else {
                    definirSituacao("erro");
                    definirErro(e.message);
                }
            });
        return () => {
            ativo = false;
        };
    }, [numeros, tentativa]);

    if (!state?.medico || !state.data || !state.hora) return <Navigate to="/agenda/novo" replace />;
    const { medico, data, hora } = state;
    const pronto = situacao === "novo" || situacao === "existente";
    function alterarCpf(valor) {
        const novoCpf = formatarCpf(valor);
        if (novoCpf === cpf) return;
        definirCpf(novoCpf);
        definirCadastro(null);
        definirCampos(camposVazios);
        definirSituacao(novoCpf.length === 14 ? "buscando" : "");
        definirErro("");
    }
    function alterarCampo(e) {
        definirCampos({ ...campos, [e.target.name]: e.target.value });
    }
    async function concluir(e) {
        e.preventDefault();
        if (!pronto || salvando || ocupado) return;
        salvar(true);
        definirErro("");
        try {
            await consultarAgenda("/agendamento", "POST", {
                idMedico: medico.id_medico,
                dataInicio: data + "T" + hora + ":00",
                paciente: {
                    ...campos,
                    cpf: numeros,
                    nome: campos.nome.trim(),
                    dataNascimento: campos.dataNascimento.split("-").reverse().join("/"),
                },
            });
            navegar("/agenda", {
                replace: true,
                state: { data, mensagem: "Consulta agendada com sucesso." },
            });
        } catch (falha) {
            definirErro(falha.message);
            marcarOcupado(falha.status === 409);
        } finally {
            salvar(false);
        }
    }
    return (
        <main className="conteudo pagina-medicos pagina-agenda">
            <CabecalhoAgenda titulo="Novo Agendamento" descricao="Insira os dados do paciente:" />
            <div className="dados-agenda">
                <form id="dados-paciente" className="cartao-agenda formulario-agenda" onSubmit={concluir}>
                    <h2>Informações Pessoais</h2>
                    <label>
                        CPF
                        <input
                            required
                            inputMode="numeric"
                            placeholder="123.456.789-00"
                            value={cpf}
                            onChange={(e) => alterarCpf(e.target.value)}
                            disabled={salvando}
                        />
                    </label>
                    {situacao === "buscando" && <span role="status">Buscando paciente...</span>}
                    {situacao === "existente" && <span role="status">Paciente encontrado pelo CPF.</span>}
                    {situacao === "erro" && (
                        <button
                            type="button"
                            onClick={() => {
                                definirErro("");
                                definirSituacao("buscando");
                                tentar((t) => t + 1);
                            }}
                        >
                            Buscar novamente
                        </button>
                    )}
                    <fieldset disabled={!pronto || salvando}>
                        <label>
                            Nome completo
                            <input
                                name="nome"
                                readOnly={Boolean(cadastro?.nome)}
                                required
                                maxLength={100}
                                value={campos.nome}
                                onChange={alterarCampo}
                                placeholder="Digite o nome do paciente..."
                            />
                        </label>
                        <label>
                            Data de nascimento
                            <input
                                type="date"
                                name="dataNascimento"
                                readOnly={Boolean(cadastro?.data_nascimento)}
                                required
                                min="1900-01-01"
                                max={dataLocal()}
                                value={campos.dataNascimento}
                                onChange={alterarCampo}
                            />
                        </label>
                        <label>
                            Telefone / WhatsApp
                            <input
                                type="tel"
                                name="telefone"
                                readOnly={Boolean(cadastro?.telefone)}
                                required
                                value={campos.telefone}
                                onChange={alterarCampo}
                                placeholder="(00) 00000-0000"
                            />
                        </label>
                        <label>
                            E-mail
                            <input
                                type="email"
                                name="email"
                                readOnly={Boolean(cadastro?.email)}
                                required
                                value={campos.email}
                                onChange={alterarCampo}
                                placeholder="seuemail@mail.com"
                            />
                        </label>
                    </fieldset>
                </form>
                <aside className="cartao-agenda resumo-agenda">
                    <h2>Resumo do Agendamento</h2>
                    <dl>
                        <dt>Médico responsável</dt>
                        <dd>{medico.nome_usuario}</dd>
                        <dt>Data e horário</dt>
                        <dd>
                            {formatarDia(data, { day: "numeric", month: "short", year: "numeric" })}, às{" "}
                            {hora.replace(":", "h")}
                        </dd>
                    </dl>
                </aside>
            </div>
            {erro && (
                <p role="alert" className="aviso-medicos erro-medicos">
                    {erro}
                </p>
            )}
            <footer className="rodape-agenda">
                <Link to="/agenda/novo/horario" state={{ medico, data, hora: ocupado ? "" : hora }}>
                    {ocupado ? "Escolher outro horário" : "Voltar"}
                </Link>
                <button
                    className="azul-agenda"
                    form="dados-paciente"
                    disabled={!pronto || salvando || ocupado}
                >
                    Concluir Agendamento
                </button>
            </footer>
        </main>
    );
}
