import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { cadastrarUsuario } from "../services/servicoAutenticacao";
import "./Cadastro.css";

const dadosIniciais = {
    nome: "",
    cpf: "",
    email: "",
    senha: "",
};

export default function Cadastro() {
    const navegar = useNavigate();
    const [dados, setDados] = useState(dadosIniciais);
    const [erro, setErro] = useState("");

    function atualizarCampo(evento) {
        setDados((dadosAnteriores) => ({
            ...dadosAnteriores,
            [evento.target.name]: evento.target.value,
        }));
    }

    async function criarConta(evento) {
        evento.preventDefault();
        setErro("");

        if (dados.cpf.replace(/\D/g, "").length !== 11) {
            setErro("O CPF deve conter 11 dígitos");
            return;
        }

        if (dados.senha.length < 8) {
            setErro("A senha deve ter no mínimo 8 caracteres");
            return;
        }

        if (!/[A-Z]/.test(dados.senha)) {
            setErro("A senha deve ter pelo menos uma letra maiúscula");
            return;
        }

        if (!/[a-z]/.test(dados.senha)) {
            setErro("A senha deve ter pelo menos uma letra minúscula");
            return;
        }

        if (!/[0-9]/.test(dados.senha)) {
            setErro("A senha deve ter pelo menos um número");
            return;
        }

        if (!/[^A-Za-z0-9]/.test(dados.senha)) {
            setErro("A senha deve ter pelo menos um caractere especial");
            return;
        }

        try {
            await cadastrarUsuario(dados);
            navegar("/login", {
                replace: true,
                state: { cadastroConcluido: true },
            });
        } catch (erroRecebido) {
            setErro(erroRecebido.message);
        }
    }

    return (
        <main className="pagina-cadastro">
            <div className="conteudo-cadastro">
                <Logo />

                <div className="cabecalho-cadastro">
                    <h1>Cadastro</h1>
                    <p>Preencha seus dados</p>
                </div>

                <form className="form-cadastro" onSubmit={criarConta}>
                    <input
                        name="nome"
                        placeholder="Nome Completo"
                        value={dados.nome}
                        onChange={atualizarCampo}
                        required
                    />

                    <input
                        name="cpf"
                        type="text"
                        placeholder="CPF"
                        maxLength={14}
                        value={dados.cpf}
                        onChange={atualizarCampo}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        value={dados.email}
                        onChange={atualizarCampo}
                        required
                    />

                    <input
                        name="senha"
                        type="password"
                        placeholder="Senha"
                        value={dados.senha}
                        onChange={atualizarCampo}
                        required
                    />

                    <button type="submit" className="btn-cadastrar">
                        Criar conta
                    </button>
                </form>

                {erro && (
                    <p className="msg-cadastro" role="alert">
                        {erro}
                    </p>
                )}
            </div>
        </main>
    );
}
