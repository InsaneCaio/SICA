import { Plus } from "lucide-react";
import "./Logo.css";

export default function Logo() {
    return (
        <span className="logo-sica">
            <Plus size={27} strokeWidth={2.8} aria-hidden="true" />
            <span>SICA</span>
        </span>
    );
}
