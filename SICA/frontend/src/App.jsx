import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LayoutPrincipal from "./components/LayoutPrincipal";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Inicio from "./pages/Inicio";
import Medicos from "./pages/Medicos";
import FormularioMedico from "./pages/FormularioMedico";
import Agenda from "./pages/agenda/Agenda";
import SelecionarMedico from "./pages/agenda/SelecionarMedico";
import EscolherHorario from "./pages/agenda/EscolherHorario";
import DadosPaciente from "./pages/agenda/DadosPaciente";
import { podeAcessarAgenda } from "./services/servicoAutenticacao";
import { Outlet } from "react-router-dom";
import "./App.css";

function AcessoAgenda() {
    return podeAcessarAgenda() ? <Outlet /> : <Navigate to="/inicio" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />

                <Route element={<LayoutPrincipal />}>
                    <Route path="/agenda" element={<AcessoAgenda />}>
                        <Route index element={<Agenda />} />
                        <Route path="novo" element={<SelecionarMedico />} />
                        <Route path="novo/horario" element={<EscolherHorario />} />
                        <Route path="novo/paciente" element={<DadosPaciente />} />
                        <Route path=":id/reagendar" element={<EscolherHorario />} />
                    </Route>
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/medicos" element={<Medicos />} />
                    <Route path="/medicos/novo" element={<FormularioMedico />} />
                    <Route path="/medicos/:id/editar" element={<FormularioMedico />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
