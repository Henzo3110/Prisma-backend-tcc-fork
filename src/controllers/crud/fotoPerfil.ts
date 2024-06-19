import { PrismaClient } from "@prisma/client";
import { string, z } from "zod";
import multer from 'multer';
import { Request, Response } from 'express';

const Foto = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'C:/Users/35424/Documents/uploads'); //ALTERE O CAMINHO DO DOCUMENTO PARA UMA PASTA NO SEU COMPUTADOR
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

async function createFotoPerfil(req: Request, res: Response) {
  try {
    // Use upload.single('foto') como middleware para processar o upload antes de chegar aqui
    upload.single('foto')(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Erro no upload do arquivo' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'Arquivo não encontrado' });
      }

      try {
        const novaFotoPerfil = await Foto.fotoPerfil.create({
          data: {
            nome: req.file.filename,
            caminho: req.file.path,
          },
        });

        return res.status(201).json({ message: 'Foto de perfil criada com sucesso!', foto: novaFotoPerfil });
      } catch (error) {
        console.error('Erro ao salvar foto de perfil no banco de dados:', error);
        return res.status(500).json({ error: 'Erro ao criar foto de perfil' });
      }
    });
  } catch (error) {
    console.error('Erro ao criar foto de perfil:', error);
    return res.status(500).json({ error: 'Erro ao criar foto de perfil' });
  }
}

async function updateFoto(req: Request, res: Response) {
  try {
    const { id_foto } = req.params;
    const updateData = req.body;

    const schema = z.object({
      nome: z.string().min(1),
      caminho: z.string().min(1),
    });

    const parsedData = schema.parse(updateData);

    try {
      const fotoAtualizada = await Foto.fotoPerfil.update({
        where: { id_foto: (id_foto) }, // Certifique-se de converter id_foto para o tipo correto
        data: parsedData,
      });

      return res.status(200).json(fotoAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar a foto de perfil no banco de dados:', error);
      return res.status(500).json({ error: 'Erro ao atualizar a foto de perfil' });
    }
  } catch (error) {
    console.error('Erro ao atualizar a foto de perfil:', error);
    return res.status(500).json({ error: 'Erro ao atualizar a foto de perfil' });
  }
}

async function findAllFotos(req:Request, res:Response){
  try {
    const fotos = await Foto.fotoPerfil.findMany();
    return res.status(200).json(fotos);
} catch (error) {
    console.log(error);
}
}

async function findOneFotos(req:Request,res:Response){
  try {
    const { id_foto } = req.params;
    const FotoExistente = await Foto.fotoPerfil.findUnique({
        where: { id_foto }
    })
    if (!FotoExistente) {
        return res.status(404).json({ message: "Foto não encontrada" });
    } else {
        return res.status(200).json(FotoExistente);
    }
} catch (error) {
    console.log(error);
}
}

async function DeleteFotos(req:Request,res:Response){
  try {
    const { id_foto } = req.params;
    if (!id_foto) {
        return res.status(409).json({ message: "Verifique o id" });
    } else {
        await Foto.fotoPerfil.delete({
            where: { id_foto }
        });
        return res.status(200).json({ message: "inscricao deletada" });
    }
} catch (error) {
    console.log(error);
}
}

export { createFotoPerfil, updateFoto, findAllFotos, findOneFotos,DeleteFotos };
