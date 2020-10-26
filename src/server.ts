import express from 'express';
import 'express-async-errors';
import './database/connection';
import routes from './routes';
import path from 'path';
import  errorHandler from './errors/handler';
import cors from 'cors';
import auth from './middlewares/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

//use the middleare for all resources disabled becausa is unimplemented in frontend.
//app.use(auth);

app.listen(3333, () => {
    console.log('Server started successfully!');
  });