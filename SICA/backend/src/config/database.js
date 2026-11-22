import dotenv from "dotenv";
import pg, { Pool } from "pg";

// CONFIGURANDO O BANCO

// Força o pg a retornar TIMESTAMP sem fuso como string pura ("YYYY-MM-DD HH:mm:ss")
pg.types.setTypeParser(1114, (str) => str);

dotenv.config();
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  //ssl: { rejectUnauthorized: false }, // Necessário para o banco na nuvem rodar
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
