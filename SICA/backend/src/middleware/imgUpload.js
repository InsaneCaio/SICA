import multer from "multer";
import criarErro from "../utils/criarErro.js";

// Guarda na memória RAM enquanto faz o upload
const storage = multer.memoryStorage();

// filtrar apenas imagens e limitar o tamanho
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(criarErro("Formato de arquivo inválido. Apenas JPEG, PNG ou WEBP", 400));
    }
  },
});

export default upload;