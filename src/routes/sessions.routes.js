import { Router } from "express";
import userModel from "../models/users.models.js";
import passport from 'passport';
import { passportError } from '../utils/messageErrors.js';
import { generateToken } from '../utils/jwt.js';

const routerSession = Router();

routerSession.post('/login', passport.authenticate('login'), async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ mensaje: 'Invalidate user' });
		}

		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			age: req.user.age,
			email: req.user.email,
		};

		const token = generateToken(req.user); // se genera el token con el usuario
		res.cookie('jwtCookie', token, {
			maxAge: 43200000,
		});

		return res.redirect('../../static/products');
	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
});

routerSession.get(
	'/github',
	passport.authenticate('github', { scope: ['user: email'] }),
	async (req, res) => {
		return res.status(200).send({ mensaje: 'Usuario creado' });
	}
);

routerSession.get('/githubSession', passport.authenticate('github'), async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ mensaje: 'Sesión creada' });
});

routerSession.get('/logout', (req, res) => {
	console.log(req.session);
	if (req.session) {
		req.session.destroy();
	}
	
	res.clearCookie('jwtCookie');
	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
});

export default routerSession;