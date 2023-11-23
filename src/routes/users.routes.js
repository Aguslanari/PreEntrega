import { Router } from 'express';
import passport from 'passport';
import usersController from '../controllers/users.controller.js';

const routerUser = Router();

routerUser.get('/', usersController.getUser); 

routerUser.post('/', passport.authenticate('register'), usersController.postUser);

routerUser.post('/recovery', usersController.recoveryPassword);

routerUser.post('/resetpassword/:token', usersController.resetPassword);

export default routerUser;