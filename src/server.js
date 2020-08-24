import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoute from './api/users.route';
import requestRoute from './api/requests.route';

const app = express();

app.use(express.json());

app.use(morgan("dev"));

// app.use(cors)

app.use('/user', userRoute);

app.use('/request', requestRoute);

export default app;