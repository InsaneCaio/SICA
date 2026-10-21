import express from 'express';
import errorHandler from './middleware/erros.js';

// IMPORTANDO AS ROTAS
import auth from './routes/auth.js';

const PORT = 3000;
const app = express();

// MIDDLEWARE
app.use(express.json());

//remover depois:
app.get('/', (req, res) => {
  res.status(200).send('Conexão funcional');
});

// ROTAS
app.use('/auth', auth); // rota de signup/login

app.use(errorHandler);

app.listen(3000, () => console.log(`Servidor rodando em http://localhost:${PORT}`));