import { z } from "zod";

export const VagaSchema = z.object({
    titulo : z.string().min(1),
    categoria : z.string().min(1),
    descricao : z.string().min(1),
    requisitos : z.string().min(1),
    salario : z.string().min(1),
    quantidade: z.string().min(1),
    dataAbertura : z.string(),
    dataFechamento : z.string(),

})