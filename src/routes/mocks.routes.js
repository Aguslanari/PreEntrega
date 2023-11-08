import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const routerMock = Router();

routerMock.get('/', mocksController.createProducts);
routerMock.get('/', passportError('jwt'), authorization('admin'), mocksController.createProducts);


export default routerMock;