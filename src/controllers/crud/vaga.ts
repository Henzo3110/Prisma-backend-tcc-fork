import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { VagaSchema } from "../../dto/validacoes/VagaValidacao";
import { z } from "zod";

const Vaga = new PrismaClient();

async function createVaga(req: Request, res: Response) {
    try {
        const {
            id_userEmpresa,
            titulo,
            categoria,
            descricao,
            requisitos,
            salario,
            quantidade,
            dataAbertura,
            dataFechamento,

        } = req.body;
        //validacao pelo zod
        VagaSchema.parse({ id_userEmpresa, titulo, categoria, descricao, requisitos, salario, quantidade, dataAbertura: new Date(dataAbertura).toISOString(), dataFechamento: new Date(dataFechamento).toISOString() });


        const createdVaga = await Vaga.vaga.create({
            data: {
                id_userEmpresa,
                titulo,
                categoria,
                descricao,
                requisitos,
                salario,
                quantidade,
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
            id_userEmpresa: z.string().uuid(),
            titulo: z.string().min(1),
            categoria: z.string().min(1),
            descricao: z.string().min(1),
            requisitos: z.string().min(1),
            salario: z.string().min(1),
            quantidade: z.string().min(1),
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
    const { filtro } = req.query;

    try {
        let vagas;

        if (typeof filtro === 'string') {
            // Consulta raw para buscar usando case-insensitive
            vagas = await Vaga.$queryRaw`
                SELECT * FROM Vaga
                WHERE titulo ILIKE '%${filtro}%'
            `;
        } else {
            vagas = await Vaga.vaga.findMany();
        }

        return res.json(vagas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar vagas' });
    }
}

async function findOneVaga(req: Request, res: Response) {
    try {
        const { id_userEmpresa } = req.params;
        const VagaExistente = await Vaga.vaga.findFirst({
            where: { id_userEmpresa }
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
            return res.status(409).json({ message: "Verifique o id na url" });
        } else {
            const vagaDeletada = await Vaga.vaga.delete({ where: { id_vaga } })
            return res.status(200).json({ message: "Vaga deletado" });
        }
    } catch (error) {
        console.log(error);
    }
}

export { createVaga, updateVaga, findAllVagas, findOneVaga, deleteVaga }