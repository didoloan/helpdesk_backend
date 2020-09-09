import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';
import userRoute from './api/users.route';
import requestRoute from './api/requests.route';


const app = express();

const server = http.createServer(app);

export const wss = new WebSocket.Server({server: server});

app.use(express.json());

app.use(morgan("dev"));

app.use(cors());

app.use('/user', userRoute);

app.use('/request', requestRoute);

export default server;