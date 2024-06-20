"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidatoVagaSchema = void 0;
const zod_1 = require("zod");
exports.candidatoVagaSchema = zod_1.z.object({
    id_userCandidato: zod_1.z.string().uuid(),
    id_vaga: zod_1.z.string().uuid(),
    dataInscricao: zod_1.z.string()
});
