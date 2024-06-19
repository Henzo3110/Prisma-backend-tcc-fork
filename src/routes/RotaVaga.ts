import { Router } from "express";
import { createVaga, deleteVaga, findAllVagas, findOneVaga, updateVaga } from "../controllers/crud/vaga";


const route = Router();

route.post("/", createVaga)
route.put("/update/:id_vaga", updateVaga)
route.get("/findAll", findAllVagas)
route.get("/findOne/:id_userEmpresa", findOneVaga)
route.delete("/delete/:id_vaga", deleteVaga)

export default route;