"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculoFormSchema = void 0;
const zod_1 = require("zod");
exports.CurriculoFormSchema = zod_1.z.object({
    id_userCandidato: zod_1.z.string().uuid(),
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
});
