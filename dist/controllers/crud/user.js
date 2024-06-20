"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.findAllUsers = exports.findOneUser = exports.updateUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserValidacao_1 = require("../../dto/validacoes/UserValidacao");
const zod_1 = require("zod");
const User = new client_1.PrismaClient();
//criação de usuario
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, senha, tipo, status, } = req.body;
            //verificação pelo zod
            UserValidacao_1.UserSchema.parse({ email, senha, tipo, status });
            //criptografa a senha, usando a biblioteca bcrypt
            const senhaCriptografada = yield bcrypt_1.default.hash(senha, 10);
            //verifica se ja existe um User com esse email
            const UserExistente = yield User.user.findUnique({ where: { email } });
            if (!UserExistente) {
                //criando o User
                const createdUser = yield User.user.create({
                    data: {
                        email,
                        senha: senhaCriptografada,
                        tipo,
                        status,
                    }
                });
                //retorna o User criado
                return res.status(201).json(createdUser);
            }
            else {
                return res.status(409).json({ message: `User com esse email: ${email} já existe!` });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.createUser = createUser;
//function de atualizar 
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_user = req.params.id_user;
            const updateData = req.body;
            const schema = zod_1.z.object({
                email: zod_1.z.string().email(),
                senha: zod_1.z.string().min(3),
                tipo: zod_1.z.string(),
                status: zod_1.z.number()
            }).partial();
            const parsedData = schema.safeParse(updateData);
            if (!parsedData.success) {
                return res.status(400).json({ error: parsedData.error.errors });
            }
            // Verificar se o usuário existe
            const userExists = yield User.user.findUnique({
                where: { id_user },
            });
            if (!userExists) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Se a senha está presente nos dados de atualização, criptografar novamente
            if (parsedData.data.senha) {
                parsedData.data.senha = yield bcrypt_1.default.hash(parsedData.data.senha, 10);
            }
            // Atualizar o usuário
            const userUpdated = yield User.user.update({
                where: { id_user },
                data: parsedData.data,
            });
            return res.status(200).json(userUpdated);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Erro ao atualizar o user' });
        }
    });
}
exports.updateUser = updateUser;
//função para retornar um json com uma lista de todos os Users
function findAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Users = yield User.user.findMany();
            return res.status(200).json(Users);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findAllUsers = findAllUsers;
function findOneUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user } = req.params;
            if (!id_user) {
                return res.status(404).json({ message: "Digite id valido" });
            }
            const UserExistente = yield User.user.findUnique({ where: { id_user } });
            if (!UserExistente) {
                return res.status(404).json({ message: `User com esse id: ${id_user} não existe!` });
            }
            else {
                return res.status(200).json(UserExistente);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.findOneUser = findOneUser;
// deletar User 
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user } = req.params;
            //verificar se esta correto o id
            if (!id_user) {
                return res.status(200).json({ message: "Digite um id valido!" });
            }
            const usuarioExistente = yield User.user.findUnique({ where: { id_user } });
            if (!usuarioExistente) {
                return res.status(404).json({ message: `Usuario com esse id: ${id_user} não existe!` });
            }
            else {
                yield User.user.delete({ where: { id_user } });
                return res.status(200).json({ message: "usuario deletado" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteUser = deleteUser;
