"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    senha: zod_1.z.string().min(3),
    tipo: zod_1.z.string(),
    status: zod_1.z.number()
});
