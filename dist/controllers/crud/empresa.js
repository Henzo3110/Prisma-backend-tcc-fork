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
exports.findOneEmpresa = exports.findAllEmpresas = exports.UpdateEmpresa = exports.CreateEmpresa = void 0;
const client_1 = require("@prisma/client");
const EmpresaValidacao_1 = require("../../dto/validacoes/EmpresaValidacao");
const zod_1 = require("zod");
const Empresa = new client_1.PrismaClient();
function CreateEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //cria empresa
            const { id_user, id_endereco, id_foto, razaoSocial, nome_fantasia, cnpj, ie, telefone, sobreMim, } = req.body;
            //verificação pelo zod
            EmpresaValidacao_1.EmpresaSchema.parse({ id_user, id_endereco, razaoSocial, nome_fantasia, cnpj, ie, telefone, sobreMim });
            //verificar endereço e User
            const VerificaEndereco = yield Empresa.endereco.findUnique({
                where: { id_endereco }
            });
            if (!VerificaEndereco) {
                return res.status(404).json({ message: 'Endereço não encontrado.' });
            }
            ;
            const VerificaUser = yield Empresa.user.findUnique({ where: { id_user } });
            if (!VerificaUser) {
                return res.status(404).json({ message: "User não encontrado" });
            }
            ;
            const verificaIe = yield Empresa.userEmpresa.findUnique({ where: { ie } });
            const usuarioExistente = yield Empresa.userEmpresa.findUnique({ where: { cnpj } });
            if (!usuarioExistente && !verificaIe) {
                const createdEmpresa = yield Empresa.userEmpresa.create({
                    data: {
                        id_user,
                        id_endereco,
                        // id_foto,
                        razaoSocial,
                        nome_fantasia,
                        cnpj,
                        ie,
                        telefone,
                        sobreMim
                    }
                });
                return res.status(201).json(createdEmpresa);
            }
            else if (usuarioExistente || !verificaIe) {
                return res.status(409).json({ message: "empresa ja existe" });
            }
            else {
                return res.status(409).json({ message: "IE ja foi cadastrado" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.CreateEmpresa = CreateEmpresa;
//atualizar empresa
function UpdateEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_userEmpresa } = req.params;
            const updateData = req.body;
            const schema = zod_1.z.object({
                id_user: zod_1.z.string().uuid(),
                id_endereco: zod_1.z.string().uuid(),
                razaoSocial: zod_1.z.string().min(1),
                nome_fantasia: zod_1.z.string().min(1),
                cnpj: zod_1.z.string().length(14),
                ie: zod_1.z.string().min(9),
                telefone: zod_1.z.string().length(11),
                sobreMim: zod_1.z.string(),
                areaDeAtuacao: zod_1.z.string(),
                especialidades: zod_1.z.string()
            }).partial();
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(400).json({ error: parsedData.error.errors });
            }
            const EmpresaUpdated = yield Empresa.userEmpresa.update({
                where: { id_userEmpresa },
                data: parsedData.data,
            });
            return res.status(200).json(EmpresaUpdated);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro ao atualizar a empresa' });
        }
    });
}
exports.UpdateEmpresa = UpdateEmpresa;
function findAllEmpresas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const empresas = yield Empresa.userEmpresa.findMany();
            return res.status(200).json(empresas);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findAllEmpresas = findAllEmpresas;
function findOneEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user } = req.params;
            if (!id_user) {
                return res.status(404).json({ message: "Digite um id válido!" });
            }
            const usuarioExistente = yield Empresa.userEmpresa.findUnique({ where: { id_user } });
            if (!usuarioExistente) {
                return res.status(409).json({ message: `Empresa com esse id: ${id_user} não existe!` });
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
exports.findOneEmpresa = findOneEmpresa;
