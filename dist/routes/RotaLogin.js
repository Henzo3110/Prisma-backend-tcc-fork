"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = __importDefault(require("../controllers/crud/login"));
const route = (0, express_1.Router)();
route.post("/", login_1.default);
exports.default = route;
