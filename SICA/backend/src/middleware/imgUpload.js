import multer from "multer";

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
      cb(new Error("Formato de arquivo inválido. Apenas JPEG, PNG ou WEBP."));
    }
  },
});

export default upload;
