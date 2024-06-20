"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriaVagaSchema = void 0;
const zod_1 = require("zod");
exports.CriaVagaSchema = zod_1.z.object({
    id_userEmpresa: zod_1.z.string().uuid(),
    id_vaga: zod_1.z.string().uuid(),
    dataCriacao: zod_1.z.string()
});
