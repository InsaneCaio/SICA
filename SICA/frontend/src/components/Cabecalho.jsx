import { UserRound as IconeUsuario } from "lucide-react";
import { obterNomeUsuario } from "../services/servicoAutenticacao";
import "./Cabecalho.css";

export default function Cabecalho() {
    return (
        <header className="cabecalho">
            <div className="usuario-cabecalho">
                <div className="avatar-usuario">
                    <IconeUsuario size={17} aria-hidden="true" />
                </div>
                <span>{obterNomeUsuario()}</span>
            </div>
        </header>
    );
}
