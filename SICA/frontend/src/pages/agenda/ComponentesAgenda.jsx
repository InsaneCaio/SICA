import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { diasDaSemana, formatarDia } from "./datas";
import "../Medicos.css";
import "./Agenda.css";

export function CabecalhoAgenda({ titulo, descricao, children }) {
    return (
        <header className="topo-medicos topo-agenda">
            <div>
                <h1>{titulo}</h1>
                {descricao && <p>{descricao}</p>}
            </div>
            {children}
        </header>
    );
}

export function Dias({ data, alterar, quantidades, unidade, minimo, maximo }) {
    return (
        <section className="dias-agenda" aria-label="Selecionar data">
            {diasDaSemana(data).map((dia) => {
                const quantidade = quantidades[dia] || 0;
                return (
                    <button
                        key={dia}
                        type="button"
                        aria-pressed={dia === data}
                        disabled={(minimo && dia < minimo) || (maximo && dia > maximo)}
                        onClick={() => alterar(dia)}
                    >
                        <span>
                            {formatarDia(dia, { weekday: "short" }).slice(0, 3)} {dia.slice(-2)}
                        </span>
                        <strong>
                            {String(quantidade).padStart(2, "0")} {unidade}
                            {quantidade !== 1 && "s"}
                        </strong>
                    </button>
                );
            })}
            <label className="calendario-agenda">
                <span>Outras datas</span>
                <strong>
                    <CalendarDays size={14} /> Abrir calendário
                </strong>
                <input
                    type="date"
                    aria-label="Outras datas"
                    value={data}
                    min={minimo}
                    max={maximo}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    onChange={(e) => {
                        if (e.target.value && e.target.validity.valid) alterar(e.target.value);
                    }}
                />
            </label>
        </section>
    );
}

export function ListaAgenda({ itens, colunas, linha, filtrar, dica, vazio, carregando, falhou }) {
    const [busca, definirBusca] = useState("");
    const [pagina, definirPagina] = useState(1);
    const filtrados = itens.filter((item) =>
        filtrar(item).toLocaleLowerCase("pt-BR").includes(busca.trim().toLocaleLowerCase("pt-BR")),
    );
    const paginas = Math.max(1, Math.ceil(filtrados.length / 10));
    const atual = Math.min(pagina, paginas);
    return (
        <section className="painel-medicos">
            <div className="pesquisa-medicos">
                <label className="campo-pesquisa-medicos">
                    <input
                        type="search"
                        aria-label={dica}
                        placeholder={dica}
                        value={busca}
                        onChange={(e) => {
                            definirBusca(e.target.value);
                            definirPagina(1);
                        }}
                    />
                    <Search size={16} />
                </label>
            </div>
            <div className="rolagem-medicos">
                <table className="tabela-medicos">
                    <thead>
                        <tr>
                            {colunas.map((nome) => (
                                <th key={nome}>{nome}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>{filtrados.slice((atual - 1) * 10, atual * 10).map(linha)}</tbody>
                </table>
            </div>
            {carregando && (
                <p className="estado-lista-medicos" role="status">
                    Carregando...
                </p>
            )}
            {!carregando && !falhou && !filtrados.length && <p className="estado-lista-medicos">{vazio}</p>}
            <div className="espaco-lista-medicos" />
            <nav className="paginacao-medicos" aria-label="Paginação">
                {Array.from({ length: paginas }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => definirPagina(i + 1)}
                        aria-current={atual === i + 1 ? "page" : undefined}
                        className={atual === i + 1 ? "selecionada" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </nav>
        </section>
    );
}
