import { z } from "zod"

export const EmpresaSchema = z.object({
    id_user : z.string().uuid(),
    id_endereco : z.string().uuid(),
    razaoSocial: z.string().min(1),
    nome_fantasia : z.string().min(1),
    cnpj : z.string().length(14).regex(new RegExp('[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}')),
    ie: z.string().min(9),
    telefone : z.string().length(11),
    sobreMim : z.string()
})