import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { EmpresaSchema } from "../../dto/validacoes/EmpresaValidacao";
import { z } from "zod";

const Empresa = new PrismaClient()

async function CreateEmpresa(req: Request, res: Response) {
    try {
        //cria empresa
        const {
            id_user,
            id_endereco,
            id_foto,
            razaoSocial,
            nome_fantasia,
            cnpj,
            ie,
            telefone,
            sobreMim
        } = req.body;
        //verificação pelo zod
        EmpresaSchema.parse({ id_user, id_endereco,id_foto, razaoSocial, nome_fantasia, cnpj, ie, telefone,sobreMim });
        //verificar endereço e User
        const VerificaEndereco = await Empresa.endereco.findUnique({
            where: { id_endereco }
        });
        if (!VerificaEndereco) {
            return res.status(404).json({ message: 'Endereço não encontrado.' });
        };
        const VerificaUser = await Empresa.user.findUnique({ where: { id_user } });
        if (!VerificaUser) { return res.status(404).json({ message: "User não encontrado" }) };

        const verificaIe = await Empresa.userEmpresa.findUnique({ where: { ie } });

        const usuarioExistente = await Empresa.userEmpresa.findUnique({ where: { cnpj } });

        if (!usuarioExistente && !verificaIe) {
            const createdEmpresa = await Empresa.userEmpresa.create({
                data: {
                    id_user,
                    id_endereco,
                    id_foto,
                    razaoSocial,
                    nome_fantasia,
                    cnpj,
                    ie,
                    telefone,
                    sobreMim
                }
            })
            return res.status(201).json(createdEmpresa);
        }
        else if (usuarioExistente || !verificaIe) {
            return res.status(409).json({ message: "empresa ja existe" });
        }
        else {
            return res.status(409).json({ message: "IE ja foi cadastrado" });
        }

    } catch (error) {
        console.log(error);
    }
}
//atualizar empresa
async function UpdateEmpresa(req: Request, res: Response) {
    try {
        const { id_userEmpresa } = req.params;
        const updateData = req.body;

        const schema = z.object({
            id_user: z.string().uuid(),
            id_endereco: z.string().uuid(),
            razaoSocial: z.string().min(1),
            nome_fantasia: z.string().min(1),
            cnpj: z.string().length(14),
            ie: z.string().min(9),
            telefone: z.string().length(11),
        }).partial();

        const parsedData = schema.safeParse(updateData);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.errors });
        }

        const EmpresaUpdated = await Empresa.userEmpresa.update({
            where: { id_userEmpresa },
            data: parsedData.data,
        });
        return res.status(200).json(EmpresaUpdated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao atualizar a empresa' });
    }
}

async function findAllEmpresas(req: Request, res: Response) {
    try {
        const empresas = await Empresa.userEmpresa.findMany();
        return res.status(200).json(empresas);
    } catch (error) {
        console.log(error);
    }
}

async function findOneEmpresa(req: Request, res: Response) {
    try {
        const { id_user } = req.params;
        if (!id_user) {
            return res.status(404).json({ message: "Digite um id válido!" });
        }
        const usuarioExistente = await Empresa.userEmpresa.findUnique({ where: { id_user } });
        if (!usuarioExistente) {
            return res.status(409).json({ message: `Empresa com esse id: ${id_user} não existe!` });
        } else {
            return res.status(200).json(usuarioExistente)
        }
    } catch (error) {
        console.log(error);
    }
}

export { CreateEmpresa, UpdateEmpresa, findAllEmpresas, findOneEmpresa }

