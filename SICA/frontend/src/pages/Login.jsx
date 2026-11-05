import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { fazerLogin } from "../services/servicoAutenticacao";
import "./Login.css";

export default function Login() {
    const navegar = useNavigate();
    const localizacao = useLocation();
    const [identificador, setIdentificador] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function entrar(evento) {
        evento.preventDefault();
        setErro("");

        try {
            await fazerLogin(identificador, senha);
            navegar("/inicio", { replace: true });
        } catch (erroRecebido) {
            setErro(erroRecebido.message);
        }
    }

    return (
        <main className="pagina-login">
            <div className="conteudo-login">
                <Logo />

                <div className="cabecalho-login">
                    <h1>Login</h1>
                    <p>Insira seu CRM/CPF e senha para acessar o sistema</p>
                </div>

                <form className="form-login" onSubmit={entrar}>
                    <input
                        type="text"
                        name="identificador"
                        placeholder="CRM ou CPF"
                        value={identificador}
                        onChange={(evento) => setIdentificador(evento.target.value)}
                        required
                    />

                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={senha}
                        onChange={(evento) => setSenha(evento.target.value)}
                        required
                    />

                    <button type="submit" className="btn-entrar">
                        Entrar
                    </button>
                </form>

                {erro && (
                    <p className="msg-login erro-login" role="alert">
                        {erro}
                    </p>
                )}

                {localizacao.state?.cadastroConcluido && (
                    <p className="msg-login sucesso-login" role="status">
                        Conta criada com sucesso
                    </p>
                )}

                <Link to="/cadastro" className="link-cadastro">
                    Não tenho conta
                </Link>
            </div>
        </main>
    );
}
