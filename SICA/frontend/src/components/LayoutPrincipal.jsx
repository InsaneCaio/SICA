import { Outlet } from "react-router-dom";
import BarraLateral from "./BarraLateral";
import Cabecalho from "./Cabecalho";
import "./LayoutPrincipal.css";

export default function LayoutPrincipal() {
    return (
        <div className="app-interno">
            <BarraLateral />

            <div className="area-principal">
                <Cabecalho />
                <Outlet />
            </div>
        </div>
    );
}
