"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFotos = exports.findOneFotos = exports.findAllFotos = exports.updateFoto = exports.createFotoPerfil = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const multer_1 = __importDefault(require("multer"));
const Foto = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/35424/Documents/uploads'); //ALTERE O CAMINHO DO DOCUMENTO PARA UMA PASTA NO SEU COMPUTADOR
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
function createFotoPerfil(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use upload.single('foto') como middleware para processar o upload antes de chegar aqui
            upload.single('foto')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err instanceof multer_1.default.MulterError) {
                    return res.status(400).json({ message: 'Erro no upload do arquivo' });
                }
                if (!req.file) {
                    return res.status(400).json({ message: 'Arquivo não encontrado' });
                }
                try {
                    const novaFotoPerfil = yield Foto.fotoPerfil.create({
                        data: {
                            nome: req.file.filename,
                            caminho: req.file.path,
                        },
                    });
                    return res.status(201).json({ message: 'Foto de perfil criada com sucesso!', foto: novaFotoPerfil });
                }
                catch (error) {
                    console.error('Erro ao salvar foto de perfil no banco de dados:', error);
                    return res.status(500).json({ error: 'Erro ao criar foto de perfil' });
                }
            }));
        }
        catch (error) {
            console.error('Erro ao criar foto de perfil:', error);
            return res.status(500).json({ error: 'Erro ao criar foto de perfil' });
        }
    });
}
exports.createFotoPerfil = createFotoPerfil;
function updateFoto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_foto } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                nome: zod_1.z.string().min(1),
                caminho: zod_1.z.string().min(1),
            });
            const parsedData = schema.parse(updateData);
            try {
                const fotoAtualizada = yield Foto.fotoPerfil.update({
                    where: { id_foto: (id_foto) }, // Certifique-se de converter id_foto para o tipo correto
                    data: parsedData,
                });
                return res.status(200).json(fotoAtualizada);
            }
            catch (error) {
                console.error('Erro ao atualizar a foto de perfil no banco de dados:', error);
                return res.status(500).json({ error: 'Erro ao atualizar a foto de perfil' });
            }
        }
        catch (error) {
            console.error('Erro ao atualizar a foto de perfil:', error);
            return res.status(500).json({ error: 'Erro ao atualizar a foto de perfil' });
        }
    });
}
exports.updateFoto = updateFoto;
function findAllFotos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fotos = yield Foto.fotoPerfil.findMany();
            return res.status(200).json(fotos);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findAllFotos = findAllFotos;
function findOneFotos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_foto } = req.params;
            const FotoExistente = yield Foto.fotoPerfil.findUnique({
                where: { id_foto }
            });
            if (!FotoExistente) {
                return res.status(404).json({ message: "Foto não encontrada" });
            }
            else {
                return res.status(200).json(FotoExistente);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneFotos = findOneFotos;
function DeleteFotos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_foto } = req.params;
            if (!id_foto) {
                return res.status(409).json({ message: "Verifique o id" });
            }
            else {
                yield Foto.fotoPerfil.delete({
                    where: { id_foto }
                });
                return res.status(200).json({ message: "inscricao deletada" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.DeleteFotos = DeleteFotos;
