import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { dataLocal, horaConsulta } from "./datas";
import "./LinhaConsulta.css";

function idadeAtual(nascimento) {
    if (!nascimento) return "Não informada";
    const hoje = dataLocal();
    const data = nascimento.slice(0, 10);
    const anos = Number(hoje.slice(0, 4)) - Number(data.slice(0, 4)) - Number(hoje.slice(5) < data.slice(5));
    return anos + (anos === 1 ? " ano" : " anos");
}

function formatarTelefone(valor) {
    const numeros = (valor || "").replace(/\D/g, "");
    return numeros.length === 10 || numeros.length === 11
        ? numeros.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3")
        : valor || "Não informado";
}

export default function LinhaConsulta({ consulta, children }) {
    const [aberto, abrir] = useState(false);
    const sufixo = consulta.tipo_atendimento === "DEPENDENTE" ? " do responsável" : "";
    const cpf = consulta.cpf_paciente?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    return (
        <>
            <tr>
                <td>
                    <div className="hora-com-detalhes">
                        <button
                            type="button"
                            aria-expanded={aberto}
                            aria-label={"Informações de " + consulta.nome_paciente}
                            onClick={() => abrir(!aberto)}
                        >
                            {aberto ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        {horaConsulta(consulta.data_inicio_consulta)}
                    </div>
                </td>
                <td>{consulta.nome_paciente}</td>
                <td>{consulta.nome_medico}</td>
                <td>{children}</td>
            </tr>
            {aberto && (
                <tr>
                    <td colSpan={4} className="informacoes-consulta">
                        <h3>Informações do paciente</h3>
                        <dl>
                            <div>
                                <dt>CPF</dt>
                                <dd>{cpf || "Não informado"}</dd>
                            </div>
                            <div>
                                <dt>Celular{sufixo}</dt>
                                <dd>{formatarTelefone(consulta.telefone_contato)}</dd>
                            </div>
                            <div>
                                <dt>Idade</dt>
                                <dd>{idadeAtual(consulta.data_nascimento_paciente)}</dd>
                            </div>
                            <div>
                                <dt>E-mail{sufixo}</dt>
                                <dd>{consulta.email_contato || "Não informado"}</dd>
                            </div>
                        </dl>
                    </td>
                </tr>
            )}
        </>
    );
}
