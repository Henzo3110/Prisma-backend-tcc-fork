import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserSchema } from "../../dto/validacoes/UserValidacao";
import { z } from "zod";


const User = new PrismaClient()

//criação de usuario
async function createUser(req: Request, res: Response) {
    try {
        const {
            email,
            senha,
            tipo,
            status,
        } = req.body;
        //verificação pelo zod
        UserSchema.parse({ email, senha, tipo, status });
        //criptografa a senha, usando a biblioteca bcrypt
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        //verifica se ja existe um User com esse email
        const UserExistente = await User.user.findUnique({ where: { email } });
        if (!UserExistente) {
            //criando o User
            const createdUser = await User.user.create({
                data: {
                    email,
                    senha: senhaCriptografada,
                    tipo,
                    status,
                }
            });
            //retorna o User criado
            return res.status(201).json(createdUser);
        } else {
            return res.status(409).json({ message: `User com esse email: ${email} já existe!` });
        }
    } catch (error) {
        console.log(error);
    }
}

//function de atualizar 
async function updateUser(req: Request, res: Response) {
    try {
        const id_user = req.params.id_user;
        const updateData = req.body;

        const schema = z.object({
            email: z.string().email(),
            senha: z.string().min(3),
            tipo: z.string(),
            status: z.number()
        }).partial();

        const parsedData = schema.safeParse(updateData);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.errors });
        }

        // Verificar se o usuário existe
        const userExists = await User.user.findUnique({
            where: { id_user },
        });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Se a senha está presente nos dados de atualização, criptografar novamente
        if (parsedData.data.senha) {
            parsedData.data.senha = await bcrypt.hash(parsedData.data.senha, 10);
        }

        // Atualizar o usuário
        const userUpdated = await User.user.update({
            where: { id_user },
            data: parsedData.data,
        });

        return res.status(200).json(userUpdated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao atualizar o user' });
    }
}


//função para retornar um json com uma lista de todos os Users
async function findAllUsers(req: Request, res: Response) {
    try {
        const Users = await User.user.findMany();
        return res.status(200).json(Users);
    } catch (error) {
        console.log(error);
    }
}

async function findOneUser(req: Request, res: Response) {
    try {
        const { id_user } = req.params;
        if (!id_user) {
            return res.status(404).json({ message: "Digite id valido" });
        }
        const UserExistente = await User.user.findUnique({ where: { id_user } });
        if (!UserExistente) {
            return res.status(404).json({ message: `User com esse id: ${id_user} não existe!` });
        } else {
            return res.status(200).json(UserExistente)
        }
    } catch (error) {
        console.log(error)
    }
}
// deletar User 
async function deleteUser(req: Request, res: Response) {

    try {
        const { id_user } = req.params;
        //verificar se esta correto o id
        if (!id_user) {
            return res.status(200).json({ message: "Digite um id valido!" });
        }
        const usuarioExistente = await User.user.findUnique({ where: { id_user } });
        if (!usuarioExistente) {
            return res.status(404).json({ message: `Usuario com esse id: ${id_user} não existe!` });
        }
        else {
            await User.user.delete({ where: { id_user } })
            return res.status(200).json({ message: "usuario deletado" });
        }
    } catch (error) {
        console.log(error)
    }
}

export { createUser, updateUser, findOneUser, findAllUsers, deleteUser }

