
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CurriculoFormSchema } from "../../dto/validacoes/Curriculo_formValidacao";
import { z } from 'zod';

const Curriculo = new PrismaClient();

async function createCurriculo(req: Request, res: Response) {
    try {
        const {
            id_userCandidato,
            nomeEmpresa,
            cargo,
            periodo,
            realizacoes,
            instituicao,
            grau,
            campoEstudo,
            periodoEstudo,
            competenciasExtracurricular,
            certificacoes,
            empresasAntecedentes
        } = req.body;

        CurriculoFormSchema.parse({ id_userCandidato, nomeEmpresa, cargo, periodo, realizacoes, instituicao, grau, campoEstudo, periodoEstudo, competenciasExtracurricular, certificacoes, empresasAntecedentes });

        const verificaCandidato = await Curriculo.userCandidato.findUnique({
            where: { id_userCandidato }
        })
        if (!verificaCandidato) {
            return res.status(404).json({ message: 'Candidato não encontrado.' });
        }
        const curriculoForm = await Curriculo.curriculo_form.create({
            data: {
                id_userCandidato,
                nomeEmpresa,
                cargo,
                periodo,
                realizacoes,
                instituicao,
                grau,
                campoEstudo,
                periodoEstudo,
                competenciasExtracurricular,
                certificacoes,
                empresasAntecedentes
            }
        });
        return res.status(201).json(curriculoForm);
    } catch (error) {
        console.log(error);
    }
}

async function updateCurriculo(req: Request, res: Response) {
    try {
        const { id_curriculoForm } = req.params;
        const updateData = req.body;

        const schema = z.object({
            nomeEmpresa: z.string().min(1),
            cargo: z.string().min(1),
            periodo: z.string().min(1),
            realizacoes: z.string().min(1),
            instituicao: z.string().min(1),
            grau: z.string().min(1),
            campoEstudo: z.string().min(1),
            periodoEstudo: z.string().min(1),
            competenciasExtracurricular: z.string().min(1),
            certificacoes: z.string().min(1),
            empresasAntecedentes: z.string().min(1)
        }).partial(); // Torna todos os campos opcionais

        const parsedData = schema.safeParse(updateData);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.errors });
        }

        const curriculoUpdated = await Curriculo.curriculo_form.update({
            where: { id_curriculoForm },
            data: parsedData.data,
        });

        return res.status(200).json(curriculoUpdated);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar o currículo' });
    }
}


async function findAllCurriculos(req: Request, res: Response) {
    try {
        const Curriculos = await Curriculo.curriculo_form.findMany();
        return res.status(200).json(Curriculos);
    } catch (error) {
        console.log(error);
    }
}

async function findOneCurriculo(req: Request, res: Response) {
    try {
        const { id_userCandidato } = req.params;
        const CurriculoExistente = await Curriculo.curriculo_form.findFirst({
            where: { id_userCandidato }
        })
        if (!CurriculoExistente) {
            return res.status(404).json({ message: "Curriculo não encontrado" });
        } else {
            return res.status(200).json(CurriculoExistente)
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteCurriculo(req: Request, res: Response) {
    try {
        const { id_curriculoForm } = req.params;
        if (!id_curriculoForm) {
            return res.status(409).send("Verifique o id na url");
        } else {
            const CvDeletado = await Curriculo.curriculo_form.delete({ where: { id_curriculoForm } })
            return res.status(200).end("CV deletado");
        }
    } catch (error) {
        console.log(error);
    }
}

export { createCurriculo, findAllCurriculos, findOneCurriculo, deleteCurriculo, updateCurriculo }