"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VagaSchema = void 0;
const zod_1 = require("zod");
exports.VagaSchema = zod_1.z.object({
    id_userEmpresa: zod_1.z.string().uuid(),
    titulo: zod_1.z.string().min(1),
    categoria: zod_1.z.string().min(1),
    descricao: zod_1.z.string().min(1),
    requisitos: zod_1.z.string().min(1),
    salario: zod_1.z.string().min(1),
    quantidade: zod_1.z.string().min(1),
    dataAbertura: zod_1.z.string(),
    dataFechamento: zod_1.z.string(),
});
