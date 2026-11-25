import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/agendamento": "http://localhost:3000",
            "/paciente": "http://localhost:3000",
            "/auth": "http://localhost:3000",
            "/medico": "http://localhost:3000",
        },
    },
});
