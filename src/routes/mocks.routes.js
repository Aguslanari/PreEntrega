import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';
import { passportError, authorization } from '../utils/messageErrors.js';

const routerMock = Router();

routerMock.get('/', mocksController.createProducts);
routerMock.get('/', passportError('jwt'), authorization('admin'), mocksController.createProducts);

export default routerMock;