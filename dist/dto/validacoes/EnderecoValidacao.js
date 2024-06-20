"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnderecoSchema = void 0;
const zod_1 = require("zod");
exports.EnderecoSchema = zod_1.z.object({
    pais: zod_1.z.string().min(2),
    estado: zod_1.z.string().min(2),
    cidade: zod_1.z.string().min(3),
    bairro: zod_1.z.string().min(4),
    logradouro: zod_1.z.string().min(1),
    complemento: zod_1.z.string(),
    numero: zod_1.z.string().min(1),
    cep: zod_1.z.string().length(8)
}).partial();
