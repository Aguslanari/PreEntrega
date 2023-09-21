import { Router } from "express";
import userModel from "../models/users.models.js";

const routerSession = Router();

routerSession.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (req.session.login) {
            return res.status(400).send({ resultado: 'isValid', message: "Ya estas logeado" });
        }

        const user = await userModel.findOne({ email: email });
        user.email === "admin@admin.com" ? req.session.userRole = "administrator" : req.session.userRole = "normal";

        if (user) {
            if (user.password == password) {
                req.session.login = true;
                req.session.email = user.email;
                res.status(200).send({ resultado: 'isValid', message: user });
            } else {
                res.status(401).send({ resultado: 'Unauthorized', message: user });
            }
        } else {
            res.status(404).send({ resultado: 'Not Found', message: user });
        }
    } catch (error) {
        res.status(400).send({ error: `Error en login: ${error}` });
    }
});


routerSession.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    if (req.session.login) {
        res.status(400).send({ error: `Ya hay una sesión iniciada` });
    }
    try {
        const response = await userModel.create({
            name,
            username,
            email,
            password
        })
        res.status(200).send({ mensaje: `Usuario ${name} creado correctamente`, respuesta: response })
    }
    catch (error) {
        res.status(400).send({ error: `Error al crear usuario: ${error}` });
    }
});

routerSession.get('/logout', (req, res) => {
    if (req.session.login) {
        try {
            req.session.destroy()
            res.status(200).send({ resultado: 'Se cerro la sesion correctamente.' })
        }
        catch (error) {
            res.status(400).send({ error: `Error al cerrar sesion: ${error}` });
        }
    } else {
        res.status(400).send({ error: `No existe sesion` });
    }
})

export default routerSession;