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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CandidatoValidacao_1 = require("../../dto/validacoes/CandidatoValidacao");
const login = new client_1.PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'secret'; //colocar no .env --> JWT_SECRET= '***'<-- uma senha segura
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: jwtSecret,
    passReqToCallback: true
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (req, jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.method + ' ' + req.baseUrl + req.url;
    console.log("user: ", jwtPayload.sub, " - url: - ", url);
    if (jwtPayload.type === 0) {
        done(null, { id: CandidatoValidacao_1.candidatoSchema }); // error first pattern
    }
    else {
        done(null, false);
    }
})));
//funcão para validar usuario ex:localhost:3000/login?email=teste@gmail.com&password=12345678
function ValidaLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, senha } = req.body;
            const validar = yield login.user.findUnique({
                where: {
                    email: String(email),
                },
            });
            if (!validar) {
                return res.status(404).json({ message: 'Email inválido' });
            }
            const validaSenha = yield bcrypt_1.default.compare(String(senha), validar.senha);
            if (!validaSenha) {
                return res.status(401).json({ message: 'Senha incorreta.' });
            }
            else {
                const token = jsonwebtoken_1.default.sign({ sub: validar.id_user, tipo: validar.tipo, type: 0 }, jwtSecret, {
                    expiresIn: '1h'
                });
                return res.status(200).json({ message: 'Credenciais válidas.', IdUsuario: validar.id_user, Senha: validar.senha, Tipo: validar.tipo, Status: validar.status, CreatedAt: validar.createdAt, UpdatedAt: validar.updatedAt, token });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao verificar credenciais.' });
        }
    });
}
;
exports.default = ValidaLogin;
