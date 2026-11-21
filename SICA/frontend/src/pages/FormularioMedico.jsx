import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Camera as IconeFoto,
    UserRound as IconeUsuario,
} from "lucide-react";
import {
    criarMedico,
    editarMedico,
    inativarMedico,
    listarEspecialidades,
    obterMedico,
} from "../services/servicoMedicos";
import "./FormularioMedico.css";

const diasSemana = [
    { valor: "SEGUNDA", rotulo: "Seg" },
    { valor: "TERCA", rotulo: "Ter" },
    { valor: "QUARTA", rotulo: "Qua" },
    { valor: "QUINTA", rotulo: "Qui" },
    { valor: "SEXTA", rotulo: "Sex" },
    { valor: "SABADO", rotulo: "Sáb" },
    { valor: "DOMINGO", rotulo: "Dom" },
];

const dadosIniciais = {
    nome: "",
    senha: "",
    sobre: "",
    crm: "",
    especialidades: [],
    valorConsulta: "",
    email: "",
    telefone: "",
    diasAtendimento: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"],
    horaInicio: "08:00",
    horaFim: "18:00",
    intervaloMinutos: 30,
    foto: null,
    fotoUrl: "",
};

function formatarHora(hora) {
    return typeof hora === "string" ? hora.slice(0, 5) : "";
}

export default function FormularioMedico() {
    const { id } = useParams();
    const editando = Boolean(id);
    const navegar = useNavigate();
    const referenciaFoto = useRef("");

    const [dados, setDados] = useState(dadosIniciais);
    const [especialidadesDisponiveis, setEspecialidadesDisponiveis] = useState([]);
    const [periodo, setPeriodo] = useState("INTEGRAL");
    const [nomeFoto, setNomeFoto] = useState("");
    const [fotoPrevia, setFotoPrevia] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [situacaoMedico, setSituacaoMedico] = useState("ATIVO");
    const [horariosDiferentes, setHorariosDiferentes] = useState(false);

    useEffect(() => {
        let ativo = true;

        async function carregarFormulario() {
            try {
                const [listaEspecialidades, medico] = await Promise.all([
                    listarEspecialidades(),
                    editando ? obterMedico(id) : Promise.resolve(null),
                ]);

                if (!ativo) {
                    return;
                }

                setEspecialidadesDisponiveis(listaEspecialidades);

                if (medico) {
                    const horarios = medico.horarios_atendimento || [];
                    const primeiroHorario = horarios[0];
                    const diferencas = horarios.some((horario) =>
                        horario.hora_inicio !== primeiroHorario.hora_inicio ||
                        horario.hora_fim !== primeiroHorario.hora_fim ||
                        Number(horario.intervalo_minutos) !== Number(primeiroHorario.intervalo_minutos)
                    );

                    setHorariosDiferentes(diferencas);
                    setSituacaoMedico(medico.status_medico);
                    setFotoPrevia(medico.foto_url || "");
                    setDados({
                        nome: medico.nome_usuario || "",
                        senha: "",
                        sobre: medico.sobre_medico || "",
                        crm: medico.crm || "",
                        especialidades: (medico.especialidades || []).map((item) => Number(item.id)),
                        valorConsulta: medico.valor_consulta ?? "",
                        email: medico.email_usuario || "",
                        telefone: medico.telefone_usuario || "",
                        diasAtendimento: [...new Set(horarios.map((horario) => horario.dia_semana))],
                        horaInicio: formatarHora(primeiroHorario?.hora_inicio) || "08:00",
                        horaFim: formatarHora(primeiroHorario?.hora_fim) || "18:00",
                        intervaloMinutos: Number(primeiroHorario?.intervalo_minutos ?? 30),
                        foto: null,
                        fotoUrl: medico.foto_url || "",
                    });

                    const inicio = formatarHora(primeiroHorario?.hora_inicio);
                    const fim = formatarHora(primeiroHorario?.hora_fim);
                    setPeriodo(
                        inicio === "08:00" && fim === "12:00" ? "MANHA" :
                        inicio === "13:00" && fim === "18:00" ? "TARDE" :
                        inicio === "08:00" && fim === "18:00" ? "INTEGRAL" : "PERSONALIZADO"
                    );
                }
            } catch (erroRecebido) {
                if (ativo) {
                    setErro(erroRecebido.message);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarFormulario();

        return () => {
            ativo = false;
        };
    }, [id, editando]);

    useEffect(() => {
        return () => {
            if (referenciaFoto.current) {
                URL.revokeObjectURL(referenciaFoto.current);
            }
        };
    }, []);

    function atualizarCampo(evento) {
        const { name, value } = evento.target;
        setDados((anteriores) => ({ ...anteriores, [name]: value }));

        if (name === "horaInicio" || name === "horaFim") {
            setPeriodo("PERSONALIZADO");
        }
    }

    function alternarDia(valor) {
        setDados((anteriores) => ({
            ...anteriores,
            diasAtendimento: anteriores.diasAtendimento.includes(valor)
                ? anteriores.diasAtendimento.filter((dia) => dia !== valor)
                : [...anteriores.diasAtendimento, valor],
        }));
    }

    function adicionarEspecialidade(evento) {
        const idEspecialidade = Number(evento.target.value);

        if (!idEspecialidade) {
            return;
        }

        setDados((anteriores) => ({
            ...anteriores,
            especialidades: anteriores.especialidades.includes(idEspecialidade)
                ? anteriores.especialidades
                : [...anteriores.especialidades, idEspecialidade],
        }));

        evento.target.value = "";
    }

    function removerEspecialidade(idEspecialidade) {
        setDados((anteriores) => ({
            ...anteriores,
            especialidades: anteriores.especialidades.filter((atual) => atual !== idEspecialidade),
        }));
    }

    function alterarPeriodo(evento) {
        const escolha = evento.target.value;
        setPeriodo(escolha);

        const horarios = {
            MANHA: ["08:00", "12:00"],
            TARDE: ["13:00", "18:00"],
            INTEGRAL: ["08:00", "18:00"],
        };

        if (horarios[escolha]) {
            setDados((anteriores) => ({
                ...anteriores,
                horaInicio: horarios[escolha][0],
                horaFim: horarios[escolha][1],
            }));
        }
    }

    function alterarFoto(evento) {
        const arquivo = evento.target.files?.[0];

        if (!arquivo) {
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
            setErro("Selecione uma imagem JPEG, PNG ou WEBP.");
            evento.target.value = "";
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            setErro("A foto não pode ultrapassar 5 MB.");
            evento.target.value = "";
            return;
        }

        if (referenciaFoto.current) {
            URL.revokeObjectURL(referenciaFoto.current);
        }

        const urlFoto = URL.createObjectURL(arquivo);
        referenciaFoto.current = urlFoto;
        setFotoPrevia(urlFoto);
        setNomeFoto(arquivo.name);
        setDados((anteriores) => ({ ...anteriores, foto: arquivo }));
        setErro("");
    }

    async function salvarMedico(evento) {
        evento.preventDefault();
        setErro("");

        if (!editando || dados.senha) {
            if (dados.senha.length < 8) {
                setErro("A senha deve ter no mínimo 8 caracteres.");
                return;
            }

            if (!/[A-Z]/.test(dados.senha)) {
                setErro("A senha deve ter pelo menos uma letra maiúscula.");
                return;
            }

            if (!/[a-z]/.test(dados.senha)) {
                setErro("A senha deve ter pelo menos uma letra minúscula.");
                return;
            }

            if (!/[0-9]/.test(dados.senha)) {
                setErro("A senha deve ter pelo menos um número.");
                return;
            }

            if (!/[^A-Za-z0-9]/.test(dados.senha)) {
                setErro("A senha deve ter pelo menos um caractere especial.");
                return;
            }
        }

        if (!/^\d{5}-[A-Za-z]{2}$/.test(dados.crm.trim())) {
            setErro("Use o formato 12345-SP (cinco dígitos e UF).");
            return;
        }

        if (dados.especialidades.length === 0) {
            setErro("Selecione pelo menos uma especialidade.");
            return;
        }

        if (dados.diasAtendimento.length === 0) {
            setErro("Selecione pelo menos um dia de atendimento.");
            return;
        }

        if (dados.horaFim <= dados.horaInicio) {
            setErro("O horário de término precisa ser posterior ao início.");
            return;
        }

        const intervalo = Number(dados.intervaloMinutos);
        if (!Number.isInteger(intervalo) || intervalo < 5 || intervalo > 60) {
            setErro("O intervalo deve ser um número inteiro de 5 a 60 minutos.");
            return;
        }

        if (horariosDiferentes && !window.confirm(
            "Este médico possui horários diferentes entre os dias. Deseja continuar?"
        )) {
            return;
        }

        setSalvando(true);

        try {
            if (editando) {
                await editarMedico(id, dados);
                navegar("/medicos", {
                    replace: true,
                    state: { mensagem: "Médico atualizado com sucesso." },
                });
            } else {
                await criarMedico(dados);
                navegar("/medicos", {
                    replace: true,
                    state: { mensagem: "Médico cadastrado com sucesso." },
                });
            }
        } catch (erroRecebido) {
            setErro(erroRecebido.message);
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarInativacao() {
        if (!window.confirm(`Deseja realmente inativar ${dados.nome}?`)) {
            return;
        }

        setErro("");

        try {
            await inativarMedico(id);
            navegar("/medicos", {
                replace: true,
                state: { mensagem: "Perfil médico inativado." },
            });
        } catch (erroRecebido) {
            setErro(erroRecebido.message);
        }
    }

    return (
        <main className="conteudo pagina-formulario-medico">
            <div className="cabecalho-formulario-medico">
                <h1>{editando ? "Editar perfil do médico" : "Cadastrar novo médico"}</h1>
                <Link to="/medicos">Voltar para a lista</Link>
            </div>

            {carregando ? (
                <p className="estado-formulario-medico">Carregando formulário...</p>
            ) : (
                <form onSubmit={salvarMedico}>
                    <div className="grade-formulario-medico">
                        <div className="coluna-formulario-medico">
                            <section className="cartao-formulario-medico">
                                <h2>{editando ? "Editar perfil do médico" : "Dados do médico"}</h2>

                                <label className="campo-formulario-medico">
                                    Nome completo
                                    <input name="nome" value={dados.nome} onChange={atualizarCampo} maxLength={150} required />
                                </label>

                                <label className="campo-formulario-medico">
                                    {editando ? "Nova senha (opcional)" : "Senha"}
                                    <input
                                        name="senha"
                                        type="password"
                                        value={dados.senha}
                                        onChange={atualizarCampo}
                                        minLength={8}
                                        placeholder={editando ? "Em branco para manter a senha atual" : "Defina a senha inicial"}
                                        required={!editando}
                                    />
                                    <span className="ajuda-senha-medico">
                                        {editando && "Preencha apenas se quiser alterar a senha. "}
                                        Mínimo de 8 caracteres, com maiúscula, minúscula, número e caractere especial.
                                    </span>
                                </label>

                                <label className="campo-formulario-medico">
                                    Sobre
                                    <textarea name="sobre" rows={3} maxLength={500} value={dados.sobre} onChange={atualizarCampo} />
                                </label>

                                <div className="campos-lado-a-lado-medico">
                                    <label className="campo-formulario-medico">
                                        CRM / UF
                                        <input name="crm" placeholder="67099-RJ" value={dados.crm} onChange={atualizarCampo} required />
                                    </label>
                                    <label className="campo-formulario-medico">
                                        Adicionar especialidade
                                        <select value="" onChange={adicionarEspecialidade} aria-label="Adicionar especialidade">
                                            <option value="">Selecione...</option>
                                            {especialidadesDisponiveis.map((especialidade) => (
                                                <option key={especialidade.id_especialidade} value={especialidade.id_especialidade}>
                                                    {especialidade.nome_especialidade}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="especialidades-selecionadas-medico" aria-label="Especialidades selecionadas">
                                    {dados.especialidades.map((idEspecialidade) => {
                                        const especialidade = especialidadesDisponiveis.find(
                                            (item) => Number(item.id_especialidade) === idEspecialidade
                                        );

                                        return (
                                            <button
                                                key={idEspecialidade}
                                                type="button"
                                                onClick={() => removerEspecialidade(idEspecialidade)}
                                                title="Remover especialidade"
                                            >
                                                {especialidade?.nome_especialidade || `Especialidade ${idEspecialidade}`} ×
                                            </button>
                                        );
                                    })}
                                </div>

                                <label className="campo-formulario-medico campo-valor-consulta">
                                    Valor da consulta (R$)
                                    <input
                                        name="valorConsulta"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="350,00"
                                        value={dados.valorConsulta}
                                        onChange={atualizarCampo}
                                        required
                                    />
                                </label>
                            </section>

                            <section className="cartao-formulario-medico">
                                <h2>Informações de contato</h2>
                                <div className="campos-lado-a-lado-medico">
                                    <label className="campo-formulario-medico">
                                        E-mail corporativo
                                        <input name="email" type="email" value={dados.email} onChange={atualizarCampo} required />
                                    </label>
                                    <label className="campo-formulario-medico">
                                        Telefone
                                        <input name="telefone" type="tel" value={dados.telefone} onChange={atualizarCampo} minLength={10} required />
                                    </label>
                                </div>
                            </section>
                        </div>

                        <div className="coluna-formulario-medico">
                            <section className="cartao-formulario-medico cartao-foto-medico">
                                <span className="foto-perfil-medico">
                                    {fotoPrevia ? (
                                        <img src={fotoPrevia} alt="Foto de perfil do médico" />
                                    ) : (
                                        <IconeUsuario size={41} aria-hidden="true" />
                                    )}
                                </span>
                                <strong>{dados.nome || "Novo médico"}</strong>
                                <label className="botao-foto-medico">
                                    <IconeFoto size={14} aria-hidden="true" />
                                    Alterar foto
                                    <input type="file" name="foto" accept="image/jpeg,image/png,image/webp" onChange={alterarFoto} />
                                </label>
                                {nomeFoto && <span className="nome-foto-medico">{nomeFoto}</span>}
                            </section>

                            <section className="cartao-formulario-medico" id="disponibilidade">
                                <h2>{editando ? "Editar disponibilidade" : "Disponibilidade"}</h2>

                                <span className="rotulo-grupo-medico">Dias de atendimento</span>
                                <div className="dias-atendimento-medico">
                                    {diasSemana.map((dia) => (
                                        <button
                                            key={dia.valor}
                                            type="button"
                                            className={dados.diasAtendimento.includes(dia.valor) ? "selecionado" : ""}
                                            aria-pressed={dados.diasAtendimento.includes(dia.valor)}
                                            onClick={() => alternarDia(dia.valor)}
                                        >
                                            {dia.rotulo}
                                        </button>
                                    ))}
                                </div>

                                <span className="rotulo-grupo-medico">Horário de atendimento</span>
                                <div className="campos-horario-medico">
                                    <label className="campo-formulario-medico">
                                        Período
                                        <select value={periodo} onChange={alterarPeriodo}>
                                            <option value="MANHA">Manhã</option>
                                            <option value="TARDE">Tarde</option>
                                            <option value="INTEGRAL">Integral</option>
                                            <option value="PERSONALIZADO">Personalizado</option>
                                        </select>
                                    </label>
                                    <label className="campo-formulario-medico">
                                        Início
                                        <input name="horaInicio" type="time" value={dados.horaInicio} onChange={atualizarCampo} required />
                                    </label>
                                    <label className="campo-formulario-medico">
                                        Término
                                        <input name="horaFim" type="time" value={dados.horaFim} onChange={atualizarCampo} required />
                                    </label>
                                </div>

                                <span className="rotulo-grupo-medico">Intervalos entre consultas</span>
                                <div className="intervalos-medico">
                                    {[15, 30, 60].map((minutos) => (
                                        <button
                                            key={minutos}
                                            type="button"
                                            className={Number(dados.intervaloMinutos) === minutos ? "selecionado" : ""}
                                            aria-pressed={Number(dados.intervaloMinutos) === minutos}
                                            onClick={() => setDados((anteriores) => ({ ...anteriores, intervaloMinutos: minutos }))}
                                        >
                                            {minutos} min
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className={![15, 30, 60].includes(Number(dados.intervaloMinutos)) ? "selecionado" : ""}
                                        aria-pressed={![15, 30, 60].includes(Number(dados.intervaloMinutos))}
                                        onClick={() => setDados((anteriores) => ({ ...anteriores, intervaloMinutos: 45 }))}
                                    >
                                        Personalizado
                                    </button>
                                </div>

                                {![15, 30, 60].includes(Number(dados.intervaloMinutos)) && (
                                    <label className="campo-formulario-medico">
                                        Personalizado (minutos)
                                        <input
                                            name="intervaloMinutos"
                                            type="number"
                                            min="5"
                                            max="60"
                                            step="1"
                                            value={dados.intervaloMinutos}
                                            onChange={atualizarCampo}
                                            required
                                        />
                                    </label>
                                )}

                                {horariosDiferentes && (
                                    <p className="aviso-horario-medico">
                                        Este médico tem horários diferentes entre os dias. Ao salvar, todos os dias selecionados passarão a usar o mesmo horário e intervalo.
                                    </p>
                                )}
                            </section>

                            {editando && situacaoMedico !== "INATIVO" && (
                                <button type="button" className="botao-inativar-medico" onClick={confirmarInativacao}>
                                    Inativar registro médico
                                </button>
                            )}
                            {editando && situacaoMedico === "INATIVO" && (
                                <p className="aviso-horario-medico">Este registro está inativo. Salvar não reativa o médico.</p>
                            )}
                        </div>
                    </div>

                    {erro && <p className="erro-formulario-medico" role="alert">{erro}</p>}

                    <div className="botoes-formulario-medico">
                        <button className="botao-salvar-medico" type="submit" disabled={salvando}>
                            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar médico"}
                        </button>
                        <Link className="botao-cancelar-medico" to="/medicos">Cancelar</Link>
                    </div>
                </form>
            )}
        </main>
    );
}
