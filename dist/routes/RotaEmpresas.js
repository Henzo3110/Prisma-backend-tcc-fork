"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresa_1 = require("../controllers/crud/empresa");
const route = (0, express_1.Router)();
route.post("/", empresa_1.CreateEmpresa);
route.put("/update/:id_userEmpresa", empresa_1.UpdateEmpresa);
route.get("/findAll", empresa_1.findAllEmpresas);
route.get("/findOne/:id_user", empresa_1.findOneEmpresa);
exports.default = route;
