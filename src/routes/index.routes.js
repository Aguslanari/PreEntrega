import { Router } from 'express';
import routerProd from './products.routes.js';
import routerCart from './carts.routes.js';
import routerMessage from './messages.routes.js';
import routerSession from './sessions.routes.js';
import routerUser from './users.routes.js';
import routerHandlebars from './handlebars.routes.js';
import routerTicket from './tickets.routes.js';
import routerMock from './mocks.routes.js';


const router = Router();

router.use('/api/tickets', routerTicket);
router.use('/api/products', routerProd);
router.use('/api/messages', routerMessage);
router.use('/api/cart', routerCart);
router.use('/api/users', routerUser);
router.use('/api/sessions', routerSession);
router.use('/static', routerHandlebars);
router.use('/api/mockingproducts', routerMock);

export default router;