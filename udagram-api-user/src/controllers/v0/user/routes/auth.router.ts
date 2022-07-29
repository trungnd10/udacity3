import { Router, Request, Response } from 'express';

import User, { UserMap } from '../models/user';
import * as c from '../../../../config/config';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';

import * as EmailValidator from 'email-validator';
import database from '../../../../database';

const router: Router = Router();


async function generatePassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainTextPassword, salt);
}

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hash);
}

function generateJWT(user: User): string {
  return jwt.sign(user.short(), c.config.jwt.secret as string);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' });
  }

  const tokenBearer = req.headers.authorization.split(' ');
  if (tokenBearer.length != 2) {
    return res.status(401).send({ message: 'Malformed token.' });
  }

  const token = tokenBearer[1];
  return jwt.verify(token, c.config.jwt.secret as string, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
    }
    return next();
  });
}

router.get('/verification',
  requireAuth,
  async (req: Request, res: Response) => {
    return res.status(200).send({ auth: true, message: 'Authenticated.' });
  });

router.post('/login', async (req: Request, res: Response) => {
  UserMap(database);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !EmailValidator.validate(email)) {
    return res.status(400).send({ auth: false, message: 'Email is required or malformed.' });
  }

  if (!password) {
    return res.status(400).send({ auth: false, message: 'Password is required.' });
  }

  const user = await User.findByPk(email);
  if (!user) {
    return res.status(401).send({ auth: false, message: 'User was not found..' });
  }

  const authValid = await comparePasswords(password, user.passwordHash);

  if (!authValid) {
    return res.status(401).send({ auth: false, message: 'Password was invalid.' });
  }

  const jwt = generateJWT(user);
  res.status(200).send({ auth: true, token: jwt, user: user.short() });
});


router.post('/', async (req: Request, res: Response) => {
  UserMap(database);
  console.log("here 1");
  const email = req.body.email;
  const plainTextPassword = req.body.password;

  if (!email || !EmailValidator.validate(email)) {
    return res.status(400).send({ auth: false, message: 'Email is missing or malformed.' });
  }

  console.log("here 2");
  if (!plainTextPassword) {
    return res.status(400).send({ auth: false, message: 'Password is required.' });
  }

  console.log("here 2.1 aaa:", email);
  const user = await User.findByPk(email).catch((e) => { console.log("error:", e) });
  console.log("here 3");
  if (user) {
    return res.status(422).send({ auth: false, message: 'User already exists.' });
  }

  console.log("here 4");
  const generatedHash = await generatePassword(plainTextPassword);

  const newUser = await new User({
    email: email,
    passwordHash: generatedHash,
  });

  console.log("here 5");
  const savedUser = await newUser.save();


  console.log("here 6");
  const jwt = generateJWT(savedUser);
  res.status(201).send({ token: jwt, user: savedUser.short() });
});

router.get('/', async (req: Request, res: Response) => {
  res.send('auth');
});

export const AuthRouter: Router = router;
