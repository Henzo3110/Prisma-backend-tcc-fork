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
exports.deleteVagaCriada = exports.findOneVagaCriada = exports.findAllCriaVaga = exports.updateCriaVaga = exports.createCriaVaga = void 0;
const client_1 = require("@prisma/client");
const CriarVagaValidacao_1 = require("../../dto/validacoes/CriarVagaValidacao");
const zod_1 = require("zod");
const CriaVaga = new client_1.PrismaClient();
function createCriaVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userEmpresa, id_vaga, dataCriacao } = req.body;
            //validação pelo zod
            CriarVagaValidacao_1.CriaVagaSchema.parse({ id_userEmpresa, id_vaga, dataCriacao: new Date(dataCriacao).toISOString() });
            const createdCriaVaga = yield CriaVaga.criarVaga.create({
                data: {
                    id_userEmpresa,
                    id_vaga,
                    dataCriacao: new Date(dataCriacao).toISOString()
                }
            });
            return res.status(201).json(createdCriaVaga);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createCriaVaga = createCriaVaga;
function updateCriaVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_criaVaga } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                id_userEmpresa: zod_1.z.string().uuid(),
                id_vaga: zod_1.z.string().uuid(),
                dataCriacao: zod_1.z.string()
            }).partial();
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(400).json({ error: parsedData.error.errors });
            }
            const CriaVagaUpdated = yield CriaVaga.criarVaga.update({
                where: { id_criaVaga },
                data: parsedData.data,
            });
            return res.status(200).json(CriaVagaUpdated);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro ao atualizar a vaga' });
        }
    });
}
exports.updateCriaVaga = updateCriaVaga;
function findAllCriaVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const VagasCriadas = yield CriaVaga.criarVaga.findMany();
            return res.status(200).json(VagasCriadas);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findAllCriaVaga = findAllCriaVaga;
function findOneVagaCriada(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_criaVaga } = req.params;
            const VagaCriada = yield CriaVaga.criarVaga.findUnique({
                where: { id_criaVaga }
            });
            if (!VagaCriada) {
                return res.status(404).json({ message: "Vaga não encontrada" });
            }
            else {
                return res.status(200).json(VagaCriada);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneVagaCriada = findOneVagaCriada;
function deleteVagaCriada(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_criaVaga } = req.params;
            if (!id_criaVaga) {
                return res.status(409).json({ message: "Verifique o id na url" });
            }
            else {
                yield CriaVaga.criarVaga.delete({
                    where: { id_criaVaga }
                });
                return res.status(200).json({ message: "vaga deletada" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteVagaCriada = deleteVagaCriada;
