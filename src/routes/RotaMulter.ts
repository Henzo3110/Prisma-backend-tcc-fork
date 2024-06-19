import { Router } from "express";
import { createFotoPerfil, DeleteFotos, findAllFotos, findOneFotos, updateFoto } from "../controllers/crud/fotoPerfil";

const route = Router();

route.post("/", createFotoPerfil)
route.put("/update/:id_foto", updateFoto)
route.get("/findAll", findAllFotos)
route.get("/findOne/:id_foto",findOneFotos)
route.delete("/delete/:id_foto", DeleteFotos)

export default route
