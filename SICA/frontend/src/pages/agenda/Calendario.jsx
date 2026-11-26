import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { dataLocal, formatarDia } from "./datas";
import "./Calendario.css";

const meses = Array.from({ length: 12 }, (_, mes) =>
    new Date(2020, mes, 1).toLocaleDateString("pt-BR", { month: "long" }),
);

function Painel({ valor, minimo, maximo, vagas, escolher, fechar, titulo }) {
    const dialogo = useRef(null);
    const anoAtivo = useRef(null);
    const [mes, definirMes] = useState(() => new Date((valor || dataLocal()) + "T12:00:00"));
    const [escolhendoAno, escolherAno] = useState(false);
    const ano = mes.getFullYear();
    const indice = mes.getMonth();
    const primeiro = new Date(ano, indice, 1).getDay();
    const tamanho = new Date(ano, indice + 1, 0).getDate();
    const anoMin = minimo ? Number(minimo.slice(0, 4)) : Math.min(1900, ano - 1);
    const anoMax = maximo ? Number(maximo.slice(0, 4)) : Math.max(new Date().getFullYear() + 100, ano + 1);
    useEffect(() => {
        const elemento = dialogo.current;
        elemento.showModal();
        return () => elemento.close();
    }, []);
    useEffect(() => {
        if (escolhendoAno) {
            anoAtivo.current?.focus();
            anoAtivo.current?.scrollIntoView({ block: "center" });
        }
    }, [escolhendoAno]);

    function irPara(novoAno, novoMes) {
        let alvo = dataLocal(new Date(novoAno, novoMes, 1, 12));
        if (minimo && alvo < minimo) alvo = minimo;
        if (maximo && alvo > maximo) alvo = maximo;
        definirMes(new Date(alvo + "T12:00:00"));
        escolherAno(false);
    }
    const mesAtual = dataLocal(mes).slice(0, 7);
    return createPortal(
        <dialog
            ref={dialogo}
            className="sica-cal"
            aria-label={titulo}
            onCancel={(e) => {
                e.preventDefault();
                fechar();
            }}
            onClick={(e) => {
                if (e.target === dialogo.current) fechar();
            }}
        >
            <div className="cal-conteudo">
                <header>
                    <strong>{titulo}</strong>
                    <button type="button" aria-label="Fechar calendário" onClick={fechar}>
                        <X size={17} />
                    </button>
                </header>
                <div className="cal-navegacao">
                    <button
                        type="button"
                        aria-label="Mês anterior"
                        disabled={mesAtual === minimo?.slice(0, 7)}
                        onClick={() => irPara(ano, indice - 1)}
                    >
                        <ChevronLeft size={17} />
                    </button>
                    <select
                        aria-label="Mês"
                        value={indice}
                        onChange={(e) => irPara(ano, Number(e.target.value))}
                    >
                        {meses.map((nome, i) => (
                            <option key={nome} value={i}>
                                {nome}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        aria-label={"Escolher ano, atual " + ano}
                        aria-expanded={escolhendoAno}
                        onClick={() => escolherAno(!escolhendoAno)}
                    >
                        {ano} ▾
                    </button>
                    <button
                        type="button"
                        aria-label="Próximo mês"
                        disabled={mesAtual === maximo?.slice(0, 7)}
                        onClick={() => irPara(ano, indice + 1)}
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
                {escolhendoAno ? (
                    <div className="cal-anos" aria-label="Anos">
                        {Array.from({ length: anoMax - anoMin + 1 }, (_, i) => anoMin + i).map((a) => (
                            <button
                                key={a}
                                type="button"
                                ref={a === ano ? anoAtivo : undefined}
                                aria-pressed={a === ano}
                                onClick={() => irPara(a, indice)}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="cal-grade">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                            <strong key={d}>{d}</strong>
                        ))}
                        {Array.from({ length: tamanho }, (_, i) => {
                            const dia = dataLocal(new Date(ano, indice, i + 1, 12));
                            const quantidade = vagas?.[dia] || 0;
                            return (
                                <button
                                    type="button"
                                    key={dia}
                                    style={i === 0 ? { gridColumnStart: primeiro + 1 } : undefined}
                                    aria-label={
                                        formatarDia(dia, { dateStyle: "long" }) +
                                        (vagas ? ", " + quantidade + " vaga(s)" : "")
                                    }
                                    aria-pressed={dia === valor}
                                    className={quantidade > 0 ? "com-vagas" : ""}
                                    disabled={
                                        (minimo && dia < minimo) ||
                                        (maximo && dia > maximo) ||
                                        (vagas && !quantidade)
                                    }
                                    onClick={() => {
                                        escolher(dia);
                                        fechar();
                                    }}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                )}
                {vagas && <p className="cal-legenda">Dia com horário disponível</p>}
            </div>
        </dialog>,
        document.body,
    );
}

export default function Calendario({ valor, escolher, minimo, maximo, vagas, nascimento = false }) {
    const [aberto, abrir] = useState(false);
    const titulo = nascimento ? "Data de nascimento" : "Selecionar data";
    return (
        <>
            <button
                type="button"
                className={nascimento ? "abrir-nascimento" : "calendario-agenda"}
                aria-label={nascimento ? "Escolher data de nascimento" : "Abrir calendário"}
                aria-haspopup="dialog"
                onClick={() => abrir(true)}
            >
                {!nascimento && <span>Outras datas</span>}
                <strong>
                    <CalendarDays size={16} />
                    {!nascimento && " Abrir calendário"}
                </strong>
            </button>
            {aberto && (
                <Painel
                    valor={valor}
                    minimo={minimo}
                    maximo={maximo}
                    vagas={vagas}
                    escolher={escolher}
                    titulo={titulo}
                    fechar={() => abrir(false)}
                />
            )}
        </>
    );
}
