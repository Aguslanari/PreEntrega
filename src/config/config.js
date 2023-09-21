import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import 'dotenv/config';

export const app = express();
const PORT = 8080;

mongoose.connect(process.env.CONNNECTIONSTRING)
    .then(() => console.log('Conectado a la BDD Mongo'))
    .catch(error => console.log("Error en conexion con DB Atlas", error));

//CREATE SERVER
export const server = app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});

export const io = new Server(server);