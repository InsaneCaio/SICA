import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { listarMedicos } from "../../services/servicoMedicos";
import { CabecalhoAgenda, ListaAgenda } from "./ComponentesAgenda";

export default function SelecionarMedico() {
    const { state } = useLocation();
    const navegar = useNavigate();
    const [medicos, definirMedicos] = useState([]);
    const [id, selecionar] = useState(state?.medico?.id_medico);
    const [erro, definirErro] = useState("");
    const [carregando, carregar] = useState(true);
    useEffect(() => {
        let ativo = true;
        listarMedicos()
            .then((lista) => {
                if (ativo) definirMedicos(lista.filter((m) => m.status_medico === "ATIVO"));
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
    const escolhido = medicos.find((m) => m.id_medico === id);
    const especialidades = (m) => m.especialidades.map((e) => e.nome).join(", ");
    return (
        <main className="conteudo pagina-medicos pagina-agenda">
            <CabecalhoAgenda titulo="Novo Agendamento" descricao="Selecione o médico:" />
            {erro && (
                <p role="alert" className="aviso-medicos erro-medicos">
                    {erro}
                </p>
            )}
            <ListaAgenda
                itens={medicos}
                colunas={["Nome", "Especialidade/CRM", "Ações"]}
                filtrar={(m) => [m.nome_usuario, m.crm, especialidades(m)].join(" ")}
                dica="Digite o nome, CRM ou especialidade"
                vazio="Nenhum médico encontrado."
                carregando={carregando}
                falhou={!!erro}
                linha={(m) => (
                    <tr key={m.id_medico} className={id === m.id_medico ? "linha-escolhida" : ""}>
                        <td>
                            <div className="identificacao-medico">
                                <span className="foto-lista-medico">
                                    {m.foto_url ? <img src={m.foto_url} alt="" /> : <UserRound size={20} />}
                                </span>
                                {m.nome_usuario}
                            </div>
                        </td>
                        <td>
                            <div className="especialidades-lista">
                                {especialidades(m)}
                                <small>CRM {m.crm}</small>
                            </div>
                        </td>
                        <td>
                            <button
                                className="azul-agenda"
                                aria-pressed={id === m.id_medico}
                                onClick={() => selecionar(m.id_medico)}
                            >
                                {id === m.id_medico ? "Selecionado" : "Selecionar"}
                            </button>
                        </td>
                    </tr>
                )}
            />
            <footer className="rodape-agenda">
                <Link to="/agenda">Voltar</Link>
                <button
                    className="azul-agenda"
                    disabled={!escolhido}
                    onClick={() => navegar("/agenda/novo/horario", { state: { medico: escolhido } })}
                >
                    Próximo
                </button>
            </footer>
        </main>
    );
}
