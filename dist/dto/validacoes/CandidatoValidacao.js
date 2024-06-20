"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidatoSchema = void 0;
const zod_1 = require("zod");
exports.candidatoSchema = zod_1.z.object({
    id_user: zod_1.z.string().uuid(),
    id_endereco: zod_1.z.string().uuid(),
    nome: zod_1.z.string().min(3),
    sobrenome: zod_1.z.string().min(3),
    cpf: zod_1.z.string().length(11).regex(new RegExp('[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}')),
    dataNascimento: zod_1.z.string(), //formato (YYYY-MM-DD)
    telefone: zod_1.z.string().length(11),
    sobreMim: zod_1.z.string()
});
