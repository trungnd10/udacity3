import {Router, Request, Response} from 'express';
import FeedItem, {FeedItemMap} from '../models/FeedItem';
import {NextFunction} from 'connect';
import * as jwt from 'jsonwebtoken';
import * as AWS from '../../../../aws';
import * as c from '../../../../config/config';
import database from '../../../../database';

const router: Router = Router();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({message: 'No authorization headers.'});
  }

  const tokenBearer = req.headers.authorization.split(' ');
  if (tokenBearer.length != 2) {
    return res.status(401).send({message: 'Malformed token.'});
  }

  const token = tokenBearer[1];
  return jwt.verify(token, c.config.jwt.secret as string, (err, decoded) => {
    if (err) {
      return res.status(500).send({auth: false, message: 'Failed to authenticate.'});
    }
    return next();
  });
}

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
  console.log("ok 1");
  FeedItemMap(database);
  const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
  console.log("ok 3", items);
  items.rows.map((item) => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  console.log("ok 4");
  res.send(items);
});

// Get a feed resource
router.get('/:id',
    async (req: Request, res: Response) => {
      FeedItemMap(database);
      const {id} = req.params;
      const item = await FeedItem.findByPk(id);
      res.send(item);
    });

// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
      const {fileName} = req.params;
      const url = AWS.getPutSignedUrl(fileName);
      res.status(201).send({url: url});
    });

// Create feed with metadata
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
      const caption = req.body.caption;
      const fileName = req.body.url; // same as S3 key name

      if (!caption) {
        return res.status(400).send({message: 'Caption is required or malformed.'});
      }

      if (!fileName) {
        return res.status(400).send({message: 'File url is required.'});
      }

      FeedItemMap(database);
      const item = await new FeedItem({
        caption: caption,
        url: fileName,
      });

      const savedItem = await item.save();

      savedItem.url = AWS.getGetSignedUrl(savedItem.url);
      res.status(201).send(savedItem);
    });

export const FeedRouter: Router = router;
