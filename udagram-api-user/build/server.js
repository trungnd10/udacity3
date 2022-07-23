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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// import {sequelize} from './sequelize';
const index_router_1 = require("./controllers/v0/index.router");
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config/config");
// import {V0_FEED_MODELS} from './controllers/v0/model.index';
(() => __awaiter(void 0, void 0, void 0, function* () {
    // await sequelize.addModels(V0_FEED_MODELS);
    console.debug("Initialize database connection...");
    // await sequelize.sync();
    const app = (0, express_1.default)();
    const port = process.env.PORT || 8080;
    app.use(body_parser_1.default.json());
    // We set the CORS origin to * so that we don't need to
    // worry about the complexities of CORS this lesson. It's
    // something that will be covered in the next course.
    app.use((0, cors_1.default)({
        allowedHeaders: [
            'Origin', 'X-Requested-With',
            'Content-Type', 'Accept',
            'X-Access-Token', 'Authorization',
        ],
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        preflightContinue: true,
        origin: '*',
    }));
    app.use('/api/v0/', index_router_1.IndexRouter);
    // Root URI call
    app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send('/api/v0/');
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running ${config_1.config.url}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
