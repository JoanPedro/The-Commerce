import 'dotenv/config';

import compression from 'compression';
import ejs from 'ejs';
import morgan from 'morgan';
import cors from 'cors';
import Youch from 'youch';
import express from 'express';
import 'express-async-errors';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use('/public', express.static(`${__dirname}/app/public`));
    this.server.use(
      '/public/images',
      express.static(`${__dirname}/app/public/images`)
    );

    this.server.set('view engine', 'ejs');

    if (process.env.NODE_ENV === 'development') this.server.use(morgan('dev'));

    this.server.use(cors());
    this.server.disable('x-powered-by'); // Retira da requisição informaçẽos do Express
    this.server.use(compression());

    this.server.use(
      express.urlencoded({ extended: true, limit: 1.5 * 1024 * 1024 }) // Limita a 1.5MB
    );
    this.server.use(express.json({ limit: 1.5 * 1024 * 1024 })); // Limita a 1.5MB
  }

  routes() {
    this.server.use(routes);

    // Error 404
    this.server.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // Error 422, 500, 401
    this.server.use((err, req, res) => {
      res.status(err.status || 500);
      if (err.status !== 404) console.warn('Error: ', err.message, new Date());
      res.json({ errors: { message: err.message, status: err.status } });
    });
  }

  exceptionHandler() {
    this.server.use(async (err, req, res) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
