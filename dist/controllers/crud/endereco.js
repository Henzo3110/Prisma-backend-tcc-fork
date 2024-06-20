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
exports.deleteEndereco = exports.findOneEndereco = exports.findAllEnderecos = exports.UpdateEndereco = exports.createEndereco = void 0;
const client_1 = require("@prisma/client");
const EnderecoValidacao_1 = require("../../dto/validacoes/EnderecoValidacao");
const zod_1 = require("zod");
const Endereco = new client_1.PrismaClient();
function createEndereco(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { pais, estado, cidade, bairro, logradouro, complemento, numero, cep } = req.body;
            //validacao pelo zod
            EnderecoValidacao_1.EnderecoSchema.parse({ pais, estado, cidade, bairro, logradouro, complemento, numero, cep });
            const createdEndereco = yield Endereco.endereco.create({
                data: {
                    pais,
                    estado,
                    cidade,
                    bairro,
                    logradouro,
                    complemento,
                    numero,
                    cep
                }
            });
            return res.status(201).json(createdEndereco);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createEndereco = createEndereco;
function UpdateEndereco(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //pegar o id pelo params
            const { id_endereco } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                pais: zod_1.z.string().min(1),
                estado: zod_1.z.string().min(1),
                cidade: zod_1.z.string().min(1),
                bairro: zod_1.z.string().min(1),
                logradouro: zod_1.z.string().min(1),
                complemento: zod_1.z.string().min(1),
                numero: zod_1.z.string().min(1),
                cep: zod_1.z.string().length(8)
            }).partial();
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(409).json({ error: parsedData.error.errors });
            }
            const EnderecoUpdated = yield Endereco.endereco.update({
                where: { id_endereco },
                data: parsedData.data
            });
            return res.status(200).json(EnderecoUpdated);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro ao atualizar o endereço' });
        }
    });
}
exports.UpdateEndereco = UpdateEndereco;
function findAllEnderecos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Enderecos = yield Endereco.endereco.findMany();
            return res.status(200).json(Enderecos);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findAllEnderecos = findAllEnderecos;
function findOneEndereco(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_endereco } = req.params;
            if (!id_endereco) {
                return res.status(404).json({ message: "digite cep valido" });
            }
            ;
            const EnderecoExistente = yield Endereco.endereco.findFirst({ where: { id_endereco } });
            if (!EnderecoExistente) {
                res.status(404).json({ message: "Endereco não existe" });
            }
            else {
                res.status(200).json(EnderecoExistente);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneEndereco = findOneEndereco;
function deleteEndereco(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_endereco } = req.params;
            if (!id_endereco) {
                return res.status(409).json({ message: "Verifique o id na url" });
            }
            else {
                yield Endereco.endereco.delete({ where: { id_endereco } });
                return res.status(200).json({ message: "endereço deletado" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteEndereco = deleteEndereco;
