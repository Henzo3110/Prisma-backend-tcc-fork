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
exports.deleteVaga = exports.findOneVaga = exports.findAllVagas = exports.updateVaga = exports.createVaga = void 0;
const client_1 = require("@prisma/client");
const VagaValidacao_1 = require("../../dto/validacoes/VagaValidacao");
const zod_1 = require("zod");
const Vaga = new client_1.PrismaClient();
function createVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userEmpresa, titulo, categoria, descricao, requisitos, salario, quantidade, dataAbertura, dataFechamento, } = req.body;
            //validacao pelo zod
            VagaValidacao_1.VagaSchema.parse({ id_userEmpresa, titulo, categoria, descricao, requisitos, salario, quantidade, dataAbertura: new Date(dataAbertura).toISOString(), dataFechamento: new Date(dataFechamento).toISOString() });
            const createdVaga = yield Vaga.vaga.create({
                data: {
                    id_userEmpresa,
                    titulo,
                    categoria,
                    descricao,
                    requisitos,
                    salario,
                    quantidade,
                    dataAbertura: new Date(dataAbertura).toISOString(),
                    dataFechamento: new Date(dataFechamento).toISOString(),
                }
            });
            return res.status(201).json(createdVaga);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createVaga = createVaga;
function updateVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //pegar o id pelo params
            const { id_vaga } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                id_userEmpresa: zod_1.z.string().uuid(),
                titulo: zod_1.z.string().min(1),
                categoria: zod_1.z.string().min(1),
                descricao: zod_1.z.string().min(1),
                requisitos: zod_1.z.string().min(1),
                salario: zod_1.z.string().min(1),
                quantidade: zod_1.z.string().min(1),
                dataAbertura: zod_1.z.string(),
                dataFechamento: zod_1.z.string(),
            }).partial();
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(400).json({ error: parsedData.error.errors });
            }
            const VagaUpdated = yield Vaga.vaga.update({
                where: { id_vaga },
                data: parsedData.data,
            });
            return res.status(200).json(VagaUpdated);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro ao atualizar a vaga' });
        }
    });
}
exports.updateVaga = updateVaga;
function findAllVagas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { filtro } = req.query;
        try {
            let vagas;
            if (typeof filtro === 'string') {
                // Consulta raw para buscar usando case-insensitive
                vagas = yield Vaga.$queryRaw `
                SELECT * FROM Vaga
                WHERE titulo ILIKE '%${filtro}%'
            `;
            }
            else {
                vagas = yield Vaga.vaga.findMany();
            }
            return res.json(vagas);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar vagas' });
        }
    });
}
exports.findAllVagas = findAllVagas;
function findOneVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userEmpresa } = req.params;
            const VagaExistente = yield Vaga.vaga.findUnique({
                where: { id_userEmpresa }
            });
            if (!VagaExistente) {
                return res.status(404).json({ message: "Vaga não encontrada" });
            }
            else {
                return res.status(200).json(VagaExistente);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneVaga = findOneVaga;
function deleteVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_vaga } = req.params;
            if (!id_vaga) {
                return res.status(409).json({ message: "Verifique o id na url" });
            }
            else {
                const vagaDeletada = yield Vaga.vaga.delete({ where: { id_vaga } });
                return res.status(200).json({ message: "Vaga deletado" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteVaga = deleteVaga;
