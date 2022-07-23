"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// src/routes/users.routes.ts
const express_1 = require("express");
const user_1 = __importStar(require("../models/user"));
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
// GET - users
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, user_1.UserMap)(database_1.default);
    const result = yield user_1.default.findAll();
    res.status(200).json({ users: result });
}));
// GET - users/:id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, user_1.UserMap)(database_1.default);
    const id = Number(req.params.id);
    const result = yield user_1.default.findByPk(id);
    res.status(200).json({ user: result });
}));
// POST - users
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser = req.body;
    console.log("input:", newUser);
    console.log("body:", req.query);
    console.log("body:", req.hostname);
    let body = "";
    req.on('readable', function () {
        let d = req.read();
        if (d) {
            body += d;
        }
    });
    req.on('end', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('body:', body);
            let u = JSON.parse(body);
            console.log("user:", u);
            (0, user_1.UserMap)(database_1.default);
            // const result = await User.create(newUser);
            // newUser = result.dataValues as User;
            const result = yield user_1.default.create(Object.assign({}, u));
            console.log('result:', result);
            let userList = yield user_1.default.findAll({
                raw: true,
                //...
            });
            newUser = userList[userList.length - 1];
            // res.status(201).json({ user: newUser });
            // res.write("OK"); 
            res.json({ user: newUser });
            res.end();
        });
    });
}));
exports.default = router;
