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
exports.updateCurriculo = exports.deleteCurriculo = exports.findOneCurriculo = exports.findAllCurriculos = exports.createCurriculo = void 0;
const client_1 = require("@prisma/client");
const Curriculo_formValidacao_1 = require("../../dto/validacoes/Curriculo_formValidacao");
const zod_1 = require("zod");
const Curriculo = new client_1.PrismaClient();
function createCurriculo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userCandidato, nomeEmpresa, cargo, periodo, realizacoes, instituicao, grau, campoEstudo, periodoEstudo, competenciasExtracurricular, certificacoes, } = req.body;
            Curriculo_formValidacao_1.CurriculoFormSchema.parse({ id_userCandidato, nomeEmpresa, cargo, periodo, realizacoes, instituicao, grau, campoEstudo, periodoEstudo, competenciasExtracurricular, certificacoes });
            const verificaCandidato = yield Curriculo.userCandidato.findUnique({
                where: { id_userCandidato }
            });
            if (!verificaCandidato) {
                return res.status(404).json({ message: 'Candidato não encontrado.' });
            }
            const curriculoForm = yield Curriculo.curriculo_form.create({
                data: {
                    id_userCandidato,
                    nomeEmpresa,
                    cargo,
                    periodo,
                    realizacoes,
                    instituicao,
                    grau,
                    campoEstudo,
                    periodoEstudo,
                    competenciasExtracurricular,
                    certificacoes,
                }
            });
            return res.status(201).json(curriculoForm);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createCurriculo = createCurriculo;
function updateCurriculo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_curriculoForm } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                nomeEmpresa: zod_1.z.string().min(1),
                cargo: zod_1.z.string().min(1),
                periodo: zod_1.z.string().min(1),
                realizacoes: zod_1.z.string().min(1),
                instituicao: zod_1.z.string().min(1),
                grau: zod_1.z.string().min(1),
                campoEstudo: zod_1.z.string().min(1),
                periodoEstudo: zod_1.z.string().min(1),
                competenciasExtracurricular: zod_1.z.string().min(1),
                certificacoes: zod_1.z.string().min(1),
            }).partial(); // Torna todos os campos opcionais
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(400).json({ error: parsedData.error.errors });
            }
            const curriculoUpdated = yield Curriculo.curriculo_form.update({
                where: { id_curriculoForm },
                data: parsedData.data,
            });
            return res.status(200).json(curriculoUpdated);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar o currículo' });
        }
    });
}
exports.updateCurriculo = updateCurriculo;
function findAllCurriculos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const curriculos = yield Curriculo.curriculo_form.findMany();
            // Use Promise.all para aguardar todas as operações assíncronas
            const result = yield Promise.all(curriculos.map((curriculo) => __awaiter(this, void 0, void 0, function* () {
                const user = yield Curriculo.userCandidato.findFirst({
                    where: { id_userCandidato: curriculo.id_userCandidato }
                });
                return Object.assign(Object.assign({}, curriculo), { userNome: user === null || user === void 0 ? void 0 : user.nome, userSobrenome: user === null || user === void 0 ? void 0 : user.sobrenome });
            })));
            return res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Ocorreu um erro ao buscar os currículos' });
        }
    });
}
exports.findAllCurriculos = findAllCurriculos;
function findOneCurriculo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userCandidato } = req.params;
            const CurriculoExistente = yield Curriculo.curriculo_form.findFirst({
                where: { id_userCandidato }
            });
            if (!CurriculoExistente) {
                return res.status(404).json({ message: "Curriculo não encontrado" });
            }
            else {
                return res.status(200).json(CurriculoExistente);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneCurriculo = findOneCurriculo;
function deleteCurriculo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_curriculoForm } = req.params;
            if (!id_curriculoForm) {
                return res.status(409).send("Verifique o id na url");
            }
            else {
                const CvDeletado = yield Curriculo.curriculo_form.delete({ where: { id_curriculoForm } });
                return res.status(200).end("CV deletado");
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteCurriculo = deleteCurriculo;
