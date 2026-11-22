import db from "../config/database.js";
import criarErro from "../utils/criarErro.js";

// GET /pacientes/cpf/:cpf
export const buscarPacientePorCPF = async (req, res, next) => {
  const cpf = req.params.cpf.replace(/\D/g, "");

  try {
    const { rows } = await db.query(
      "SELECT * FROM vw_pacientes WHERE cpf = $1",
      [cpf],
    );

    if (rows.length === 0) {
      return next(criarErro("Paciente não encontrado", 404));
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    return next(criarErro("Erro interno do servidor", 500));
  }
};
