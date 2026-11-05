import { Fragment, useState } from "react";
import {
    ChevronDown as IconeExpandir,
    ChevronRight as IconeRecolher,
    Search as IconePesquisa,
} from "lucide-react";
import { obterNomeUsuario } from "../services/servicoAutenticacao";
import "./Inicio.css";

const consultasDemonstracao = [
    {
        id: 1,
        horario: "09h30",
        paciente: "Rodrigo Soares",
        medico: "Dr. Rodolfo Neves",
        cpf: "000.000.000-00",
        idade: 34,
        celular: "(15) 90000-0001",
        email: "rodrigo.exemplo@email.com",
        situacao: "Paciente Presente",
    },
    {
        id: 2,
        horario: "10h30",
        paciente: "Pamela Roberta dos Santos",
        medico: "Dr. Rodolfo Neves",
        cpf: "824.125.752-23",
        idade: 30,
        celular: "(15) 93123-0442",
        email: "pamela.exemplo@email.com",
        situacao: "Paciente Ausente",
    },
    {
        id: 3,
        horario: "13h00",
        paciente: "Mariana Costa",
        medico: "Dra. Amanda Oliveira",
        cpf: "555.231.865-03",
        idade: 27,
        celular: "(15) 90000-0003",
        email: "mariana.exemplo@email.com",
        situacao: "Concluída",
    },
    {
        id: 4,
        horario: "14h30",
        paciente: "Carlos Almeida",
        medico: "Dra. Amanda Oliveira",
        cpf: "123.654.987-33",
        idade: 41,
        celular: "(15) 90000-0004",
        email: "carlos.exemplo@email.com",
        situacao: "Paciente Presente",
    },
];

const consultasPorPagina = 2;
const opcoesSituacao = ["Paciente Presente", "Paciente Ausente", "Concluída"];

export default function Inicio() {
    const [pesquisa, setPesquisa] = useState("");
    const [pagina, setPagina] = useState(1);
    const [detalhesAbertos, setDetalhesAbertos] = useState([2]);
    const [situacoes, setSituacoes] = useState({});
    
    const termo = pesquisa.toLocaleLowerCase("pt-BR").trim();
    const consultasFiltradas = consultasDemonstracao.filter(({ paciente, medico }) =>
        `${paciente} ${medico}`.toLocaleLowerCase("pt-BR").includes(termo)
    );

    const totalPaginas = Math.ceil(consultasFiltradas.length / consultasPorPagina);
    const paginaAtual = Math.min(pagina, Math.max(1, totalPaginas));
    const consultasExibidas = consultasFiltradas.slice(
        (paginaAtual - 1) * consultasPorPagina,
        paginaAtual * consultasPorPagina
    );

    function alternarDetalhes(id) {
        setDetalhesAbertos((anteriores) =>
            anteriores.includes(id)
                ? anteriores.filter((atual) => atual !== id)
                : [...anteriores, id]
        );
    }

    function alterarPesquisa(evento) {
        setPesquisa(evento.target.value);
        setPagina(1);
    }

    function alterarSituacao(id, novaSituacao) {
        setSituacoes((anteriores) => ({
            ...anteriores,
            [id]: novaSituacao,
        }));
    }

    return (
        <main className="conteudo pagina-inicio">
            <section className="boas-vindas">
                <h1>Bem-vindo(a), {obterNomeUsuario()}</h1>
            </section>

            <h2 className="titulo-secao">Consultas Hoje</h2>

            <section className="consultas">
                <div className="barra-pesquisa">
                    <label className="campo-pesquisa">
                        <input
                            type="search"
                            placeholder="Digite o nome do paciente ou do médico..."
                            value={pesquisa}
                            onChange={alterarPesquisa}
                        />
                        <IconePesquisa size={15} aria-hidden="true" />
                    </label>
                </div>

                <div className="rolagem-tabela">
                    <table className="tabela-consultas">
                        <thead>
                            <tr>
                                <th scope="col">HORÁRIO</th>
                                <th scope="col">NOME DO PACIENTE</th>
                                <th scope="col">MÉDICO</th>
                                <th scope="col">SITUAÇÃO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultasExibidas.map((consulta) => {
                                const aberto = detalhesAbertos.includes(consulta.id);
                                const situacao = situacoes[consulta.id] || consulta.situacao;
                                const estiloSituacao = situacao === "Concluída"
                                    ? "concluida"
                                    : situacao === "Paciente Ausente" ? "ausente" : "presente";

                                return (
                                    <Fragment key={consulta.id}>
                                        <tr>
                                            <td className="horario-consulta">
                                                <button
                                                    className="btn-detalhes"
                                                    type="button"
                                                    onClick={() => alternarDetalhes(consulta.id)}
                                                >
                                                    {aberto
                                                        ? <IconeExpandir size={15} />
                                                        : <IconeRecolher size={15} />}
                                                </button>
                                                <span>{consulta.horario}</span>
                                            </td>
                                            <td>{consulta.paciente}</td>
                                            <td>{consulta.medico}</td>
                                            <td>
                                                <select
                                                    className={`situacao-consulta ${estiloSituacao}`}
                                                    value={situacao}
                                                    onChange={(evento) => alterarSituacao(consulta.id, evento.target.value)}
                                                >
                                                    {opcoesSituacao.map((opcao) => (
                                                        <option key={opcao} value={opcao}>
                                                            {opcao}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>

                                        {aberto && (
                                            <tr className="linha-detalhes">
                                                <td colSpan={4}>
                                                    <div className="detalhes-paciente">
                                                        <h3>Informações Paciente</h3>
                                                        <div className="grade-detalhes">
                                                            <span>CPF: {consulta.cpf}</span>
                                                            <span>Celular: {consulta.celular}</span>
                                                            <span>Idade: {consulta.idade}</span>
                                                            <span>E-mail: {consulta.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}

                            {consultasExibidas.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="sem-resultados">
                                        Nenhuma consulta encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="espaco-tabela" />

                {totalPaginas > 1 && (
                    <nav className="paginacao">
                        {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numero) => (
                            <button
                                key={numero}
                                type="button"
                                className={paginaAtual === numero ? "selecionada" : ""}
                                onClick={() => setPagina(numero)}
                            >
                                {numero}
                            </button>
                        ))}
                    </nav>
                )}
            </section>
        </main>
    );
}
