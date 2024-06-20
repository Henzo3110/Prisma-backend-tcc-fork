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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneCandidato = exports.findAllCandidatos = exports.UpdateCandidato = exports.createCandidato = void 0;
const client_1 = require("@prisma/client");
const CandidatoValidacao_1 = require("../../dto/validacoes/CandidatoValidacao");
const zod_1 = require("zod");
const Candidato = new client_1.PrismaClient();
//criar candidato
function createCandidato(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_endereco, id_foto, nome, sobrenome, cpf, dataNascimento, telefone, sobreMim } = req.body;
            //verificação pelo zod
            CandidatoValidacao_1.candidatoSchema.parse({ id_user, id_endereco, id_foto, nome, sobrenome, cpf, dataNascimento: new Date(dataNascimento).toISOString(), telefone, sobreMim });
            if (!CandidatoValidacao_1.candidatoSchema.parse) {
                return res.status(409).json({ message: 'Erro na validação dos dados' });
            }
            //verificar endereco e /user
            const VerificaEndereco = yield Candidato.endereco.findUnique({
                where: { id_endereco }
            });
            if (!VerificaEndereco) {
                return res.status(404).json({ message: 'Endereço não encontrado.' });
            }
            ;
            const VerificaUser = yield Candidato.user.findUnique({ where: { id_user } });
            if (!VerificaUser) {
                return res.status(404).json({ message: "User não encontrado" });
            }
            ;
            const usuarioExistente = yield Candidato.userCandidato.findUnique({ where: { cpf } });
            // se o usuario não existe vai criar, se existe vai dar erro e mostrar o cpf
            if (!usuarioExistente) {
                yield Candidato.userCandidato.create({
                    data: {
                        id_user,
                        id_endereco,
                        // id_foto,
                        nome,
                        sobrenome,
                        cpf,
                        dataNascimento: new Date(dataNascimento).toISOString(),
                        telefone,
                        sobreMim
                    }
                });
                return res.status(201).json({ message: `candidato criado com sucesso!` });
            }
            else {
                return res.status(409).json({ message: `Usuario com esse cpf: ${cpf} já existe!` });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createCandidato = createCandidato;
//atualizar candidato
function UpdateCandidato(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userCandidato } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                id_user: zod_1.z.string().uuid(),
                id_endereco: zod_1.z.string().uuid(),
                id_foto: zod_1.z.string().uuid(),
                nome: zod_1.z.string().min(1),
                sobrenome: zod_1.z.string().min(1),
                cpf: zod_1.z.string().length(11),
                dataNascimento: zod_1.z.string(),
                telefone: zod_1.z.string().length(11),
                sobreMim: zod_1.z.string().min(1)
            }).partial();
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(400).json({ error: parsedData.error.errors });
            }
            const CandidatoExist = yield Candidato.userCandidato.findUnique({ where: { id_userCandidato } });
            const CandidatoUpdated = yield Candidato.userCandidato.update({
                where: { id_userCandidato },
                data: parsedData.data,
            });
            return res.status(200).json(CandidatoUpdated);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro ao atualizar o candidato' });
        }
    });
}
exports.UpdateCandidato = UpdateCandidato;
//encontrar todos os candidatos
function findAllCandidatos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidatos = yield Candidato.userCandidato.findMany();
            return res.status(200).json({ candidatos });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findAllCandidatos = findAllCandidatos;
//encontrar pelo params pedido
function findOneCandidato(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user } = req.params;
            if (!id_user) {
                return res.status(409).json({ message: "Digite um id valido!" });
            }
            const usuarioExistente = yield Candidato.userCandidato.findUnique({ where: { id_user } });
            if (!usuarioExistente) {
                return res.status(404).json({ message: `Candidato não existe!` });
            }
            else {
                return res.status(200).json(usuarioExistente);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneCandidato = findOneCandidato;
