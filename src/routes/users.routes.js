import { Router } from "express";
import userModel from "../models/users.models.js";

const routerUser = Router();

routerUser.post('/', async (req, res) => {
    const { name, username, email, password} = req.body;

    try {
        const response = await userModel.create({
            name,
            username,
            email,
            password
        })
        res.status(200).send({ mensaje: `Usuario ${name} creado`, respuesta: response })
    }
    catch (error) {
        res.status(400).send({ error: `Error al crear usuario: ${error}` });
    }
});

export default routerUser;