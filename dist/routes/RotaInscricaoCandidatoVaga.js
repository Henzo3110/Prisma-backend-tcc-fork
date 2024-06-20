"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidatoVaga_1 = require("../controllers/crud/candidatoVaga");
const route = (0, express_1.Router)();
route.post("/", candidatoVaga_1.CreateInscricaoCandVaga);
route.put("/update/:id_inscricao", candidatoVaga_1.updateInscricao);
route.get("/findAll", candidatoVaga_1.findAllInscricoes);
route.get("/findOne/:id_inscricao", candidatoVaga_1.findOneInscricao);
route.delete("/delete/:id_inscricao", candidatoVaga_1.deleteInscricao);
exports.default = route;