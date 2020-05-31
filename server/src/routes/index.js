import { Router } from 'express';
import v1Api from './api/v1';

const routes = new Router();

routes.use('/v1/api', v1Api);
routes.get('/', (req, res) => res.send({ ok: true }));

routes.use((err, req, res) => {
  if (err.name === 'ValidationErro') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key.message];
        return errors;
      }, {}),
    });
  }

  return '';
});

export default routes;
