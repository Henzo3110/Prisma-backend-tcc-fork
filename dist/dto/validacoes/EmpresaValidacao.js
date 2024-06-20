"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaSchema = void 0;
const zod_1 = require("zod");
exports.EmpresaSchema = zod_1.z.object({
    id_user: zod_1.z.string().uuid(),
    id_endereco: zod_1.z.string().uuid(),
    razaoSocial: zod_1.z.string().min(1),
    nome_fantasia: zod_1.z.string().min(1),
    cnpj: zod_1.z.string().length(14).regex(new RegExp('[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}')),
    ie: zod_1.z.string().min(9),
    telefone: zod_1.z.string().length(11),
    sobreMim: zod_1.z.string()
});
