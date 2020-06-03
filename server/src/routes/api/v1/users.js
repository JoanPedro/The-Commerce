import { Router } from 'express';
import auth from '../../auth';
import UserController from '../../../app/controllers/User';

const routes = new Router();
// routes.get('/', (req, res) => {
//   return res.json({ msg: 'OK' });
// });
routes.get('/', auth.required, UserController.index);
routes.get('/:id', auth.required, UserController.show);
// routes.put('/', auth.required, UserController.update);
// routes.delete('/', auth.required, UserController.destroy);

// routes.post('/login', UserController.login);
routes.post('/register', UserController.store);

// routes.get('/password-recovery', UserController.showRecovery);
// routes.post('/password-recovery', UserController.createRecovery);

// routes.get('/recoveried-password', UserController.showCompleteRecovery);
// routes.post('/recoveried-password', UserController.completeRecovery);

export default routes;
