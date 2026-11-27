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
    turnos: {
        manha: { horaInicio: "08:00", horaFim: "12:00" },
        tarde: { horaInicio: "13:00", horaFim: "18:00" },
    },
    intervaloMinutos: 30,
    foto: null,
    fotoUrl: "",
};

function formatarHora(hora) {
    return typeof hora === "string" ? hora.slice(0, 5) : "";
}

function aplicarMascaraHora(valor) {
    if (valor.includes(":")) {
        const [hora, minutos = ""] = valor.split(":");
        const horaFormatada = hora.replace(/\D/g, "").slice(0, 2).padStart(2, "0");
        const minutosFormatados = minutos.replace(/\D/g, "").slice(0, 2);

        return `${horaFormatada}:${minutosFormatados}`;
    }

    const numeros = valor.replace(/\D/g, "").slice(0, 4);

    if (numeros.length <= 2) {
        return numeros;
    }

    return `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
}

function horarioValido(hora) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);
}

function extrairTurnos(horarios) {
    const faixasUnicas = new Map();
    const faixasPorDia = new Map();
    const intervalos = new Set();
    const duracoes = new Set();

    horarios.forEach((horario) => {
        const horaInicio = formatarHora(horario.hora_inicio);
        const horaFim = formatarHora(horario.hora_fim);

        if (!horaInicio || !horaFim) {
            return;
        }

        const chave = `${horaInicio}-${horaFim}`;

        if (!faixasUnicas.has(chave)) {
            faixasUnicas.set(chave, { horaInicio, horaFim });
        }

        if (!faixasPorDia.has(horario.dia_semana)) {
            faixasPorDia.set(horario.dia_semana, new Set());
        }

        faixasPorDia.get(horario.dia_semana).add(chave);

        if (horario.intervalo_minutos !== null && horario.intervalo_minutos !== undefined) {
            intervalos.add(Number(horario.intervalo_minutos));
        }

        if (horario.duracao_minutos !== null && horario.duracao_minutos !== undefined) {
            duracoes.add(Number(horario.duracao_minutos));
        }
    });

    const faixas = [...faixasUnicas.values()].sort((a, b) =>
        a.horaInicio.localeCompare(b.horaInicio)
    );

    let faixaManha = null;
    let faixaTarde = null;

    if (faixas.length === 1) {
        if (faixas[0].horaInicio >= "12:00") {
            faixaTarde = faixas[0];
        } else {
            faixaManha = faixas[0];
        }
    } else {
        faixaManha = faixas[0] || null;
        faixaTarde = faixas[1] || null;
    }

    const assinaturasPorDia = new Set(
        [...faixasPorDia.values()].map((faixasDoDia) =>
            [...faixasDoDia].sort().join("|")
        )
    );

    const diasAtendimento = [...new Set(horarios.map((horario) => horario.dia_semana))];

    return {
        turnos: {
            manha: faixaManha || { horaInicio: "08:00", horaFim: "12:00" },
            tarde: faixaTarde || { horaInicio: "13:00", horaFim: "18:00" },
        },
        usarManha: Boolean(faixaManha),
        usarTarde: Boolean(faixaTarde),
        diasAtendimento,
        intervaloMinutos: Number(horarios[0]?.intervalo_minutos ?? 30),
        horariosDiferentes:
            assinaturasPorDia.size > 1 ||
            faixas.length > 2 ||
            intervalos.size > 1 ||
            duracoes.size > 1 ||
            (duracoes.size === 1 && !duracoes.has(30)),
    };
}

export default function FormularioMedico() {
    const { id } = useParams();
    const editando = Boolean(id);
    const navegar = useNavigate();
    const referenciaFoto = useRef("");

    const [dados, setDados] = useState(dadosIniciais);
    const [especialidadesDisponiveis, setEspecialidadesDisponiveis] = useState([]);
    const [usarManha, setUsarManha] = useState(true);
    const [usarTarde, setUsarTarde] = useState(true);
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
                    const horarios = Array.isArray(medico.horarios_atendimento)
                        ? medico.horarios_atendimento
                        : [];
                    const configuracao = extrairTurnos(horarios);

                    setHorariosDiferentes(configuracao.horariosDiferentes);
                    setUsarManha(configuracao.usarManha);
                    setUsarTarde(configuracao.usarTarde);
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
                        diasAtendimento: configuracao.diasAtendimento,
                        turnos: configuracao.turnos,
                        intervaloMinutos: configuracao.intervaloMinutos,
                        foto: null,
                        fotoUrl: medico.foto_url || "",
                    });
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
    }

    function atualizarHorario(turno, campo, evento) {
        const valor = aplicarMascaraHora(evento.target.value);

        setDados((anteriores) => ({
            ...anteriores,
            turnos: {
                ...anteriores.turnos,
                [turno]: {
                    ...anteriores.turnos[turno],
                    [campo]: valor,
                },
            },
        }));
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

        const turnos = {
            manha: usarManha ? dados.turnos.manha : null,
            tarde: usarTarde ? dados.turnos.tarde : null,
        };

        if (!turnos.manha && !turnos.tarde) {
            setErro("Ative pelo menos um período de atendimento.");
            return;
        }

        for (const [nome, turno] of Object.entries(turnos)) {
            if (!turno) {
                continue;
            }

            const nomePeriodo = nome === "manha" ? "manhã" : "tarde";

            if (!horarioValido(turno.horaInicio) || !horarioValido(turno.horaFim)) {
                setErro(`Informe horários válidos para o período da ${nomePeriodo}. Use o formato 24 horas HH:mm.`);
                return;
            }

            if (turno.horaFim <= turno.horaInicio) {
                setErro(`O término do período da ${nomePeriodo} precisa ser posterior ao início.`);
                return;
            }
        }

        if (turnos.manha && turnos.tarde && turnos.tarde.horaInicio < turnos.manha.horaFim) {
            setErro("O período da tarde deve começar após o término da manhã.");
            return;
        }

        const intervalo = Number(dados.intervaloMinutos);
        if (!Number.isInteger(intervalo) || intervalo < 5 || intervalo > 60) {
            setErro("O intervalo deve ser um número inteiro de 5 a 60 minutos.");
            return;
        }

        if (horariosDiferentes && !window.confirm(
            "Este médico possui horários diferentes entre os dias ou mais de duas faixas. Ao salvar, todos os dias selecionados passarão a usar os turnos exibidos no formulário. Deseja continuar?"
        )) {
            return;
        }

        const dadosParaSalvar = { ...dados, turnos };

        setSalvando(true);

        try {
            if (editando) {
                await editarMedico(id, dadosParaSalvar);
                navegar("/medicos", {
                    replace: true,
                    state: { mensagem: "Médico atualizado com sucesso." },
                });
            } else {
                await criarMedico(dadosParaSalvar);
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
                                <div className="turnos-medico">
                                    <section className="turno-medico">
                                        <label className="cabecalho-turno-medico">
                                            <input
                                                type="checkbox"
                                                checked={usarManha}
                                                onChange={(evento) => setUsarManha(evento.target.checked)}
                                            />
                                            <strong>Atendimento pela manhã</strong>
                                        </label>

                                        {usarManha && (
                                            <div className="campos-horario-medico">
                                                <label className="campo-formulario-medico">
                                                    Início
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={5}
                                                        placeholder="08:00"
                                                        value={dados.turnos.manha.horaInicio}
                                                        onChange={(evento) => atualizarHorario("manha", "horaInicio", evento)}
                                                        required
                                                    />
                                                </label>
                                                <label className="campo-formulario-medico">
                                                    Término
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={5}
                                                        placeholder="12:00"
                                                        value={dados.turnos.manha.horaFim}
                                                        onChange={(evento) => atualizarHorario("manha", "horaFim", evento)}
                                                        required
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </section>

                                    <section className="turno-medico">
                                        <label className="cabecalho-turno-medico">
                                            <input
                                                type="checkbox"
                                                checked={usarTarde}
                                                onChange={(evento) => setUsarTarde(evento.target.checked)}
                                            />
                                            <strong>Atendimento à tarde</strong>
                                        </label>

                                        {usarTarde && (
                                            <div className="campos-horario-medico">
                                                <label className="campo-formulario-medico">
                                                    Início
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={5}
                                                        placeholder="13:00"
                                                        value={dados.turnos.tarde.horaInicio}
                                                        onChange={(evento) => atualizarHorario("tarde", "horaInicio", evento)}
                                                        required
                                                    />
                                                </label>
                                                <label className="campo-formulario-medico">
                                                    Término
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={5}
                                                        placeholder="18:00"
                                                        value={dados.turnos.tarde.horaFim}
                                                        onChange={(evento) => atualizarHorario("tarde", "horaFim", evento)}
                                                        required
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </section>
                                </div>
                                <small className="ajuda-horario-medico">
                                    Informe os horários no formato de 24 horas (HH:mm).
                                </small>

                                <span className="rotulo-grupo-medico">Intervalos entre consultas</span>
                                <small className="ajuda-horario-medico">
                                    O intervalo selecionado será aplicado aos dois períodos.
                                </small>
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
                                        Este médico possui horários diferentes entre os dias ou mais de duas faixas. Ao salvar, todos os dias selecionados passarão a usar os turnos exibidos acima.
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
