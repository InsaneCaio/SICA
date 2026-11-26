import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Pencil as IconeEditar,
    Plus as IconeAdicionar,
    Search as IconePesquisa,
    Trash2 as IconeInativar,
    UserRound as IconeUsuario,
} from "lucide-react";
import { inativarMedico, listarMedicos } from "../services/servicoMedicos";
import "./Medicos.css";

const medicosPorPagina = 10;

export default function Medicos() {
    const localizacao = useLocation();
    const [medicos, setMedicos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [pagina, setPagina] = useState(1);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState(localizacao.state?.mensagem || "");
    const [atualizacao, setAtualizacao] = useState(0);

    useEffect(() => {
        let ativo = true;

        listarMedicos()
            .then((resultado) => {
                if (ativo) {
                    setMedicos(resultado);
                    setErro("");
                }
            })
            .catch((erroRecebido) => {
                if (ativo) {
                    setErro(erroRecebido.message);
                }
            })
            .finally(() => {
                if (ativo) {
                    setCarregando(false);
                }
            });

        return () => {
            ativo = false;
        };
    }, [atualizacao]);

    const termo = pesquisa.trim().toLocaleLowerCase("pt-BR");
    const medicosFiltrados = medicos.filter((medico) => {
        const especialidades = (medico.especialidades || [])
            .map((especialidade) => especialidade.nome)
            .join(" ");
        const texto = `${medico.nome_usuario} ${medico.crm} ${especialidades}`;

        return texto.toLocaleLowerCase("pt-BR").includes(termo);
    });

    const totalPaginas = Math.max(1, Math.ceil(medicosFiltrados.length / medicosPorPagina));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const medicosVisiveis = medicosFiltrados.slice(
        (paginaAtual - 1) * medicosPorPagina,
        paginaAtual * medicosPorPagina
    );

    function alterarPesquisa(evento) {
        setPesquisa(evento.target.value);
        setPagina(1);
    }

    async function confirmarInativacao(medico) {
        if (!window.confirm(`Deseja realmente inativar ${medico.nome_usuario}?`)) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            await inativarMedico(medico.id_medico);
            setMedicos((anteriores) =>
                anteriores.map((atual) =>
                    atual.id_medico === medico.id_medico
                        ? { ...atual, status_medico: "INATIVO" }
                        : atual
                )
            );
            setMensagem("Médico inativado com sucesso.");
        } catch (erroRecebido) {
            setErro(erroRecebido.message);
        }
    }

    function atualizarLista() {
        setCarregando(true);
        setErro("");
        setAtualizacao((anterior) => anterior + 1);
    }

    return (
        <main className="conteudo pagina-medicos">
            <section className="topo-medicos">
                <h1>Diretório Médico</h1>
                <Link className="botao-novo-medico" to="/medicos/novo">
                    <IconeAdicionar size={16} aria-hidden="true" />
                    Adicionar novo cadastro
                </Link>
            </section>

            {mensagem && <p className="aviso-medicos sucesso-medicos" role="status">{mensagem}</p>}
            {erro && (
                <div className="aviso-medicos erro-medicos" role="alert">
                    {erro}
                    <button type="button" onClick={atualizarLista}>Tentar novamente</button>
                </div>
            )}

            <section className="painel-medicos" aria-label="Lista de médicos">
                <div className="pesquisa-medicos">
                    <label className="campo-pesquisa-medicos">
                        <input
                            type="search"
                            placeholder="Digite o nome, CRM ou especialidade"
                            aria-label="Pesquisar médicos"
                            value={pesquisa}
                            onChange={alterarPesquisa}
                        />
                        <IconePesquisa size={16} aria-hidden="true" />
                    </label>
                </div>

                <div className="rolagem-medicos">
                    <table className="tabela-medicos">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Especialidade / CRM</th>
                                <th>Situação</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicosVisiveis.map((medico) => (
                                <tr key={medico.id_medico}>
                                    <td>
                                        <div className="identificacao-medico">
                                            <span className="foto-lista-medico">
                                                {medico.foto_url ? (
                                                    <img src={medico.foto_url} alt="" />
                                                ) : (
                                                    <IconeUsuario size={20} aria-hidden="true" />
                                                )}
                                            </span>
                                            <span>{medico.nome_usuario}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="especialidades-lista">
                                            {(medico.especialidades || []).map((item) => item.nome).join(", ") || "Sem especialidade"}
                                            <small>CRM {medico.crm}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`etiqueta-situacao ${medico.status_medico === "INATIVO" ? "inativo" : "ativo"}`}>
                                            {medico.status_medico === "INATIVO" ? "Inativo" : "Ativo"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="acoes-medico">
                                            <Link
                                                to={`/medicos/${medico.id_medico}/editar`}
                                                className="acao-medico"
                                                aria-label={`Editar ${medico.nome_usuario}`}
                                                title="Editar perfil"
                                            >
                                                <IconeEditar size={16} aria-hidden="true" />
                                            </Link>
                                            <button
                                                type="button"
                                                className="acao-medico acao-inativar"
                                                onClick={() => confirmarInativacao(medico)}
                                                disabled={medico.status_medico === "INATIVO"}
                                                aria-label={`Inativar ${medico.nome_usuario}`}
                                                title="Inativar registro"
                                            >
                                                <IconeInativar size={16} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {carregando && <p className="estado-lista-medicos">Carregando médicos...</p>}
                    {!carregando && !erro && medicosFiltrados.length === 0 && (
                        <p className="estado-lista-medicos">Nenhum médico encontrado.</p>
                    )}
                </div>

                <div className="espaco-lista-medicos" />

                <div className="paginacao-medicos" aria-label="Paginação de médicos">
                    {Array.from({ length: totalPaginas }, (_, indice) => (
                        <button
                            key={indice + 1}
                            type="button"
                            className={paginaAtual === indice + 1 ? "selecionada" : ""}
                            onClick={() => setPagina(indice + 1)}
                            aria-current={paginaAtual === indice + 1 ? "page" : undefined}
                        >
                            {indice + 1}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}
