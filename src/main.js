import express from 'express';
import 'dotenv/config';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js';
import path from 'path';
import router from './routes/index.routes.js';

import messageModel from './models/message.models.js';
import productModel from './models/products.models.js';

import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.js';
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
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/', router);
