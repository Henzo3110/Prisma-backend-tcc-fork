import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { candidatoSchema } from "../../dto/validacoes/CandidatoValidacao";
import { z } from "zod";


const Candidato = new PrismaClient()
//criar candidato
async function createCandidato(req: Request, res: Response) {
    try {
        const {
            id_user,
            id_endereco,
            nome,
            sobrenome,
            cpf,
            dataNascimento,
            telefone,
            sobreMim
        } = req.body;
        //verificação pelo zod
        candidatoSchema.parse({ id_user, id_endereco, nome, sobrenome, cpf, dataNascimento: new Date(dataNascimento).toISOString(), telefone, sobreMim });
        if(!candidatoSchema.parse) {
            return res.status(409).json({message: 'Erro na validação dos dados'});
        }
        //verificar endereco e /user
        const VerificaEndereco = await Candidato.endereco.findUnique({
            where: { id_endereco }
        });
        if (!VerificaEndereco) {
            return res.status(404).json({ message: 'Endereço não encontrado.' });
        };

        const VerificaUser = await Candidato.user.findUnique({ where: { id_user } });
        if (!VerificaUser) { return res.status(404).json({ message: "User não encontrado" }) };

        const usuarioExistente = await Candidato.userCandidato.findUnique({ where: { cpf } });
        // se o usuario não existe vai criar, se existe vai dar erro e mostrar o cpf
        if (!usuarioExistente) {
            await Candidato.userCandidato.create({
                data: {
                    id_user,
                    id_endereco,
                    nome,
                    sobrenome,
                    cpf,
                    dataNascimento: new Date(dataNascimento).toISOString(),
                    telefone,
                    sobreMim
                }
            })
            return res.status(201).json({ message: `candidato criado com sucesso!` });
        } else {
            return res.status(409).json({ message: `Usuario com esse cpf: ${cpf} já existe!` });
        }
    }
    catch (error) {
        console.log(error);
    }
}

//atualizar candidato
async function UpdateCandidato(req: Request, res: Response) {
    try {
        const { id_userCandidato } = req.params;
        const updateData = req.body;

        const schema = z.object({
            id_user: z.string().uuid(),
            id_endereco: z.string().uuid(),
            nome: z.string().min(1),
            sobrenome: z.string().min(1),
            cpf: z.string().length(11),
            dataNascimento: z.string(),
            telefone: z.string().length(11),
            sobreMim : z.string().min(1)
        }).partial();

        const parsedData = schema.safeParse(updateData);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.errors });
        }

        const CandidatoExist = await Candidato.userCandidato.findUnique({where: {id_userCandidato}})

        const CandidatoUpdated = await Candidato.userCandidato.update({
            where: { id_userCandidato },
            data: parsedData.data,
        });
        return res.status(200).json(CandidatoUpdated);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao atualizar o candidato' });
    }
}

//encontrar todos os candidatos
async function findAllCandidatos(req: Request, res: Response) {
    try {
        const candidatos = await Candidato.userCandidato.findMany();
        return res.status(200).json({ candidatos });
    } catch (error) {
        console.log(error);
    }
}
//encontrar pelo params pedido
async function findOneCandidato(req: Request, res: Response) {
    try {
        const { id_user } = req.params;
        if (!id_user) {
            return res.status(409).json({ message: "Digite um id valido!" });
        }
        const usuarioExistente = await Candidato.userCandidato.findUnique({ where: { id_user } });
        if (!usuarioExistente) {
            return res.status(404).json({ message: `Candidato não existe!` });
        }
        else {
            return res.status(200).json(usuarioExistente);
        }
    } catch (error) {
        console.log(error);
    }
}


export { createCandidato, UpdateCandidato, findAllCandidatos, findOneCandidato }