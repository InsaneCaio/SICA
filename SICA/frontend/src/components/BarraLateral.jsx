import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home as IconeInicio, LogOut as IconeSair } from "lucide-react";
import { encerrarSessao } from "../services/servicoAutenticacao";
import Logo from "./Logo";
import "./BarraLateral.css";

export default function BarraLateral() {
    const navegar = useNavigate();

    async function sair() {
        try {
            await encerrarSessao();
            navegar("/login", { replace: true });
        } catch (erro) {
            window.alert(erro.message);
        }
    }

    return (
        <aside className="barra-lateral">
            <Link className="link-logo" to="/inicio">
                <Logo />
            </Link>

            <nav className="menu-lateral">
                <NavLink to="/inicio">
                    <IconeInicio size={17} aria-hidden="true" />
                    <span>Início</span>
                </NavLink>
            </nav>

            <div className="menu-inferior">
                <button className="btn-sair" type="button" onClick={sair}>
                    <IconeSair size={17} aria-hidden="true" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}
