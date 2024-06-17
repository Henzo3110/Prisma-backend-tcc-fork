import { z } from "zod";

export const CurriculoFormSchema = z.object({
    id_userCandidato: z.string().uuid(),
    nomeEmpresa : z.string().min(1),
    cargo : z.string().min(1),
    periodo : z.string().min(1),
    realizacoes : z.string().min(1),
    instituicao : z.string().min(1),
    grau : z.string().min(1),
    campoEstudo : z.string().min(1),
    periodoEstudo : z.string().min(1),
    competenciasExtracurricular : z.string().min(1),
    certificacoes: z.string().min(1),
})