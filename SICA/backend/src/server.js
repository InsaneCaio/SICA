import express from 'express';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/erros.js';
import cors from 'cors';

// IMPORTANDO AS ROTAS
import auth from './routes/auth.js';
import medico from './routes/medico.js';

const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true, // obrigatório para enviar cookies
  }),
);

app.get("/", (req, res) => res.json({ status: "API online" }));

// ROTAS
app.use('/auth', auth);     // rota de signup/login
app.use('/medico', medico); // rota de crud medico

app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));