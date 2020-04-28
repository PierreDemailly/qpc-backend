import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as path from 'path';
import routes from './routes/routes';
import { updateToken } from './middlewares/updateToken';

createConnection().then(async () => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors({
      exposedHeaders: 'Authorization',
    }));
    app.use(helmet());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use(bodyParser.json());

    app.use('/avatars', express.static(path.join('avatars')));
    // set all routes from routes folder
    // try to update jwt for each request
    app.use('/api', [updateToken, routes]);

    app.listen(3000, () => {
      console.log('Server started on port 3000!');
    });
  })
  .catch(error => console.log(error));