import express, { Router } from "express";
import dotenv from "dotenv";
import cors from 'cors';

import RouterEmpresas from './routes/RotaEmpresas'
import RouterCandidatos from './routes/RotaCandidato'
import RouterEndereco from './routes/rotaEndereco'
import RouterVaga from './routes/RotaVaga'
import RouterCurriculo from './routes/RotaCurriculo'
import RouterInscricoes from './routes/RotaInscricaoCandidatoVaga'
import RouterCriaVaga from './routes/RotaCriaVaga'
import RouterLogin from './routes/RotaLogin'
import passport from "passport";
import RouterUsers from './routes/RotaUser'


dotenv.config();

const app = express();
app.use(cors({
    "origin": ["http://localhost:5173"],
    "methods": "GET,PUT,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (_req, res) => {
    res.status(200).json({ response: 'Servidor rodando.' })
  })

app.use("/empresas", RouterEmpresas)
app.use("/candidatos", RouterCandidatos)
app.use("/enderecos", RouterEndereco)
app.use("/vagas", RouterVaga)
app.use("/curriculos", RouterCurriculo)
app.use("/inscricoes", RouterInscricoes)
app.use("/criarVagas", RouterCriaVaga)
app.use("/token", passport.authenticate('jwt', { session: false }), RouterLogin);
app.use("/login", RouterLogin)
app.use("/users", RouterUsers)


app.listen(process.env.PORT, () => {
    console.log(`escutando na porta ${process.env.PORT}`)
});

