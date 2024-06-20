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
exports.deleteInscricao = exports.findOneInscricao = exports.findAllInscricoes = exports.updateInscricao = exports.CreateInscricaoCandVaga = void 0;
const client_1 = require("@prisma/client");
const CandidadoVagaValidacao_1 = require("../../dto/validacoes/CandidadoVagaValidacao");
const zod_1 = require("zod");
const InscricaoCandVaga = new client_1.PrismaClient();
function CreateInscricaoCandVaga(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userCandidato, id_vaga, dataInscricao } = req.body;
            //verificação pelo zod
            CandidadoVagaValidacao_1.candidatoVagaSchema.parse({ id_userCandidato, id_vaga, dataInscricao: new Date(dataInscricao).toISOString() });
            const VerificaCandidato = yield InscricaoCandVaga.userCandidato.findUnique({
                where: { id_userCandidato }
            });
            if (!VerificaCandidato) {
                return res.status(404).json({ message: "Candidato não encontrado" });
            }
            const VerificaVaga = yield InscricaoCandVaga.vaga.findUnique({
                where: { id_vaga }
            });
            if (!VerificaVaga) {
                return res.status(404).json({ messsage: "Vaga não encontrada" });
            }
            const createdInscricao = yield InscricaoCandVaga.candidatoVaga.create({
                data: {
                    id_userCandidato,
                    id_vaga,
                    dataInscricao: new Date(dataInscricao).toISOString()
                }
            });
            return res.status(201).json(createdInscricao);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.CreateInscricaoCandVaga = CreateInscricaoCandVaga;
function updateInscricao(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_inscricao } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                id_userCandidato: zod_1.z.string().uuid(),
                id_vaga: zod_1.z.string().uuid(),
                dataInscrica: zod_1.z.string()
            }).partial();
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(400).json({ error: parsedData.error.errors });
            }
            const IncricaoUpdated = yield InscricaoCandVaga.candidatoVaga.update({
                where: { id_inscricao },
                data: parsedData.data,
            });
            return res.status(200).json(IncricaoUpdated);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro ao atualizar a Vaga Candidato' });
        }
    });
}
exports.updateInscricao = updateInscricao;
function findAllInscricoes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Inscricoes = yield InscricaoCandVaga.candidatoVaga.findMany();
            return res.status(200).json(Inscricoes);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findAllInscricoes = findAllInscricoes;
function findOneInscricao(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_inscricao } = req.params;
            const InscricaoExistente = yield InscricaoCandVaga.candidatoVaga.findUnique({
                where: { id_inscricao }
            });
            if (!InscricaoExistente) {
                return res.status(404).json({ message: "Inscricao não encontrada" });
            }
            else {
                return res.status(200).json(InscricaoExistente);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneInscricao = findOneInscricao;
function deleteInscricao(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_inscricao } = req.params;
            if (!id_inscricao) {
                return res.status(409).json({ message: "Verifique o id na url" });
            }
            else {
                yield InscricaoCandVaga.candidatoVaga.delete({
                    where: { id_inscricao }
                });
                return res.status(200).json({ message: "inscricao deletada" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteInscricao = deleteInscricao;
