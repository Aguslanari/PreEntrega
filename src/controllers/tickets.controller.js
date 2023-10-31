import ticketModel from '../models/tickets.models.js';
import { v4 as uuidv4 } from 'uuid';
import mailSender from '../utils/mailSender.js';

const getTickets = async (req, res) => {
	try {
		const response = await ticketModel.find();

		res.status(200).send({ response: response });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al consultar tickets ${error}` });
	}
};
const createTicket = async (req, res) => {
	const { amount, email } = req.body;
	try {
		const ticket = {
			code: uuidv4(),
			amount: amount,
			purchaser: email,
		};
		await ticketModel.create(ticket);
		
		const ticketGenerado = await ticketModel.findOne({ code: ticket.code });
        await mailSender.sendEmail(ticket.code, email, "Ticket Generado!", null);
		
		res.status(201).send({ response: 'Ticket generado con éxito', message: ticketGenerado });
		
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el ticket ${error}` });
	}
};

const ticketsController = { createTicket, getTickets };

export default ticketsController;