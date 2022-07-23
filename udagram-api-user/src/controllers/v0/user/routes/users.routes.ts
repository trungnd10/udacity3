// src/routes/users.routes.ts
import { Router, Request, Response } from 'express';
import User, { UserMap } from '../models/user';
import database from '../../../../database';
import { AuthRouter } from './auth.router';
const router = Router();

const { Client } = require("pg");
const client = new Client({
    password: "123456",
    user: "postgres",
    host: "192.168.68.109",
    port: 4321
  });
  
router.use('/auth', AuthRouter);

// GET - users
router.get('/', async (req: Request, res: Response) => {
    UserMap(database);
    const result = await User.findAll();
    res.status(200).json({ users: result });
});
// GET - users/:id
router.get('/:id', async (req: Request, res: Response) => {
    UserMap(database);
    const id = Number(req.params.id);
    const result = await User.findByPk(id);
    res.status(200).json({ user: result });
});
// POST - users
router.post('/', async (req: Request, res: Response) => {
    let newUser = req.body as User;
    console.log("input:", newUser);
    console.log("body:", req.query);
    console.log("body:", req.hostname);
    console.log("body:", req.body);

    console.log("ok 3");
    // const results = await client
    // .query("SELECT * FROM employees")
    // .then((payload: { rows: any; }) => {
    //     console.log("okkkkkkkkkkkkke:", payload);
    //     return payload.rows;
    // })
    // .catch(() => {
    //   throw new Error("Query failed");
    // });
    // console.log("okkkkkkkkkkkkke:::", results);

    UserMap(database);
    // const result = await User.create(newUser);
    // newUser = result.dataValues as User;
    const result = await User.create({ ...req.body }).catch((e) => { console.log('error:', e) });
    console.log('result:', result);
    let userList = await User.findAll({
        raw: true,
        //...
    });
    newUser = userList[userList.length - 1];
    // res.status(201).json({ user: newUser });

    // res.write("OK"); 
    res.json({ user: newUser });
    res.end();
});
export default router;