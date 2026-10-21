import dotenv from "dotenv";
import { Pool } from "pg";

// CONFIGURANDO O BANCO
dotenv.config();
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// TESTANDO CONEXÃO
db.query("SELECT NOW()")
  .then((result) => {
    console.log("Banco Conectado!");
    console.log(result.rows);
  })
  .catch((error) => {
    console.error("Não foi possivel conectar-se ao Banco");
    console.error(error);
  });

export default db;
