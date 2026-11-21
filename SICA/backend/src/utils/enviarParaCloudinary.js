import cloudinary from "../config/cloudinary.js";
import criarErro from "./criarErro.js";

export const enviarParaCloudinary = (
  fileBuffer,
  //userId,
  identificador,
  pasta
  // pasta = "usuarios",
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: pasta,
        // Usar public_id com o ID do usuário garante que, se ele trocar de foto,
        // a anterior é substituída automaticamente sem acumular lixo
        public_id: `foto_${identificador}`,
        overwrite: true,
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face" }, // Foca no rosto e corta 300x300
          { quality: "auto", fetch_format: "auto" }, // Otimiza peso e converte para formato leve (webp)
        ],
      },
      (error, result) => {
        
        if (error) {

          if (error.message.includes("Invalid image file") || error.message.includes("Empty file")) {
            return reject(criarErro("O arquivo enviado não é uma imagem válida.", 400));
          }

          return reject(error);
        }

        resolve(result);
      },
    );

    // Envia os bytes da memória para a Cloudinary
    stream.end(fileBuffer);
  });
};
