import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LayoutPrincipal from "./components/LayoutPrincipal";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Inicio from "./pages/Inicio";
import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route element={<LayoutPrincipal />}>
                    <Route path="/inicio" element={<Inicio />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
