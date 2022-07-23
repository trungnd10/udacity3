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
exports.FeedRouter = exports.requireAuth = void 0;
const express_1 = require("express");
const FeedItem_1 = __importStar(require("../models/FeedItem"));
const jwt = __importStar(require("jsonwebtoken"));
const AWS = __importStar(require("../../../../aws"));
const c = __importStar(require("../../../../config/config"));
const database_1 = __importDefault(require("../../../../database"));
const router = (0, express_1.Router)();
function requireAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    const tokenBearer = req.headers.authorization.split(' ');
    if (tokenBearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }
    const token = tokenBearer[1];
    return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        return next();
    });
}
exports.requireAuth = requireAuth;
// Get all feed items
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ok 1");
    (0, FeedItem_1.FeedItemMap)(database_1.default);
    const items = yield FeedItem_1.default.findAndCountAll({ order: [['id', 'DESC']] });
    console.log("ok 3", items);
    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    console.log("ok 4");
    res.send(items);
}));
// Get a feed resource
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, FeedItem_1.FeedItemMap)(database_1.default);
    const { id } = req.params;
    const item = yield FeedItem_1.default.findByPk(id);
    res.send(item);
}));
// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
}));
// Create feed with metadata
router.post('/', requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const caption = req.body.caption;
    const fileName = req.body.url; // same as S3 key name
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed.' });
    }
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required.' });
    }
    (0, FeedItem_1.FeedItemMap)(database_1.default);
    const item = yield new FeedItem_1.default({
        caption: caption,
        url: fileName,
    });
    const savedItem = yield item.save();
    savedItem.url = AWS.getGetSignedUrl(savedItem.url);
    res.status(201).send(savedItem);
}));
exports.FeedRouter = router;
