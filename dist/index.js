"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const RotaEmpresas_1 = __importDefault(require("./routes/RotaEmpresas"));
const RotaCandidato_1 = __importDefault(require("./routes/RotaCandidato"));
const rotaEndereco_1 = __importDefault(require("./routes/rotaEndereco"));
const RotaVaga_1 = __importDefault(require("./routes/RotaVaga"));
const RotaCurriculo_1 = __importDefault(require("./routes/RotaCurriculo"));
const RotaInscricaoCandidatoVaga_1 = __importDefault(require("./routes/RotaInscricaoCandidatoVaga"));
const RotaLogin_1 = __importDefault(require("./routes/RotaLogin"));
const passport_1 = __importDefault(require("passport"));
const RotaUser_1 = __importDefault(require("./routes/RotaUser"));
const RotaMulter_1 = __importDefault(require("./routes/RotaMulter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    "origin": "http://localhost:5173",
    "methods": "GET,PUT,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_req, res) => {
    res.status(200).json({ response: 'Servidor rodando.' });
});
app.use("/empresas", RotaEmpresas_1.default);
app.use("/candidatos", RotaCandidato_1.default);
app.use("/enderecos", rotaEndereco_1.default);
app.use("/vagas", RotaVaga_1.default);
app.use("/curriculos", RotaCurriculo_1.default);
app.use("/inscricoes", RotaInscricaoCandidatoVaga_1.default);
app.use("/token", passport_1.default.authenticate('jwt', { session: false }), RotaLogin_1.default);
app.use("/login", RotaLogin_1.default);
app.use("/users", RotaUser_1.default);
app.use("/fotos", RotaMulter_1.default);
app.listen(process.env.PORT, () => {
    console.log(`escutando na porta ${process.env.PORT}`);
});
