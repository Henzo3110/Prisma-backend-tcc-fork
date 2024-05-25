import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { VagaSchema } from "../../dto/validacoes/VagaValidacao";
import { z } from "zod";

const Vaga = new PrismaClient();

async function createVaga(req: Request, res: Response) {
    try {
        const {
            titulo,
            categoria,
            descricao,
            requisitos,
            dataAbertura,
            dataFechamento,

        } = req.body;
        //validacao pelo zod
        VagaSchema.parse({ titulo, categoria, descricao, requisitos, dataAbertura: new Date(dataAbertura).toISOString(), dataFechamento: new Date(dataFechamento).toISOString() });


        const createdVaga = await Vaga.vaga.create({
            data: {
                titulo,
                categoria,
                descricao,
                requisitos,
                dataAbertura: new Date(dataAbertura).toISOString(),
                dataFechamento: new Date(dataFechamento).toISOString(),
            }
        });
        return res.status(201).json(createdVaga);
    } catch (error) {
        console.log(error);
    }
}

async function updateVaga(req: Request, res: Response) {
    try {
        //pegar o id pelo params
        const { id_vaga } = req.params;
        const updateData = req.body;

        const schema = z.object({
            titulo: z.string().min(1),
            categoria: z.string().min(1),
            descricao: z.string().min(1),
            requisitos: z.string().min(1),
            dataAbertura: z.string(),
            dataFechamento: z.string(),
        }).partial();

        const parsedData = schema.safeParse(updateData);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.errors });
        }

        const VagaUpdated = await Vaga.vaga.update({
            where: { id_vaga },
            data: parsedData.data,
        });
        return res.status(200).json(VagaUpdated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao atualizar a vaga' });
    }
}

async function findAllVagas(req: Request, res: Response) {
    try {
        const Vagas = await Vaga.vaga.findMany();
        return res.status(200).json(Vagas);
    } catch (error) {
        console.log(error);
    }
}

async function findOneVaga(req: Request, res: Response) {
    try {
        const { id_vaga } = req.params;
        const VagaExistente = await Vaga.vaga.findUnique({
            where: { id_vaga }
        })
        if (!VagaExistente) {
            return res.status(404).json({ message: "Vaga não encontrada" });
        } else {
            return res.status(200).json(VagaExistente)
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteVaga(req: Request, res: Response) {
    try {
        const { id_vaga } = req.params;
        if (!id_vaga) {
            return res.status(400).json({ message: "Verifique o id na url" });
        } else {
            const vagaDeletada = await Vaga.vaga.delete({ where: { id_vaga } })
            return res.status(200).json({ message: "Vaga deletado" });
        }
    } catch (error) {
        console.log(error);
    }
}

export { createVaga, updateVaga, findAllVagas, findOneVaga, deleteVaga }