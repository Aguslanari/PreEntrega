import express from 'express';
import 'dotenv/config';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js';
import path from 'path';



import messageModel from './models/message.models.js';
import productModel from './models/products.models.js';
import userModel from './models/users.models.js';

import routerProd from './routes/products.routes.js';
import routerCart from './routes/carts.routes.js';
import routerMessage from './routes/messages.routes.js';
import routerSession from './routes/sessions.routes.js';
import routerUser from './routes/users.routes.js';

import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { app, io } from './config/config.js';

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
app.use(session({
	secret: process.env.SESSION_SECRET,
	store: MongoStore.create({
		mongoUrl: process.env.CONNNECTIONSTRING,
		mongoOptions: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		},
		ttl: 600
	}),
}));

//Auth para admin
const authAdmin = (req, res, next) => {
	if (req.session.email == "admin@admin.com") {
		return next();
	}
	return res.send("No tenes acceso a este contenido");
}

//Auth para usuarios logueados
const authUser = (req, res, next) => {
	if (req.session.login) {
		return next();
	}
	return res.send("No tenes acceso a este contenido");
}

// Conexión con socket.io
io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 5 });
		socket.emit('products', data);
	});

	socket.on('previousPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page });
		socket.emit('products', data);
	});

	socket.on('nextPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page });
		socket.emit('products', data);
	});

	socket.on('newProduct', async product => {
		await productModel.create(product);
		const products = await productModel.find();

		socket.emit('products', products);
	});

	socket.on('mensaje', async info => {
		const { email, message } = info;
		await messageModel.create({
			email,
			message,
		});
		const messages = await messageModel.find();

		io.emit('mensajes', messages);
	});
});

// Routes
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api/products', routerProd);
app.use('/api/carts', routerCart);
app.use('/api/messages', routerMessage);
app.use('/api/users', routerUser)
app.use('/api/sessions', routerSession)
app.get('/static', (req, res) => {
	res.render('index', {
		rutaCSS: 'index',
		rutaJS: 'index',
	});
});

app.get('/static/home', authUser, (req, res) => {
    res.render('home', {
        rutaCSS: "home",
        rutaJS: "home",
        email: req.session.email,
        userRole: req.session.userRole
    });
});

app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});

app.get('/static/chat', (req, res) => {
	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	});
});

app.get('/static/products', (req, res) => {
	res.render('products', {
		rutaCSS: 'products',
		rutaJS: 'products',
	});
});

app.get('/static/login', (req, res) => {
    res.render('login', {
        rutaCSS: "login",
        rutaJS: "login",
    });
});

app.get('/static/register', (req, res) => {
    res.render('register', {
        rutaCSS: "register",
        rutaJS: "register"
    });
});

