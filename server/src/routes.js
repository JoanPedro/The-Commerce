import { Router } from 'express';

const routes = new Router();

//
routes.get('/', (req, res) => {
  return res.json({ resp: 'OK' });
});

export default routes;
