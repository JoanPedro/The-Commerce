import { Router } from 'express';
import UsersRoutes from './users';

const routes = new Router();

routes.use('/users', UsersRoutes);

// routes.get('/users', (req, res) => {
//   return res.json({ msg: true });
// });

export default routes;
