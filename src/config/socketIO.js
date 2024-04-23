
import Product from "../dao/models/products.models.js";
import Message from "../dao/models/messages.models.js";
import { Server } from 'socket.io';
import { logger } from '../utils.js';

export const initializeSocket = (server) => {

    const io = new Server(server);
    io.on('connection', socket => {
        logger.info('Conexión con Socket.io');

        //Products
        socket.on('loadProducts', async () => {
            const products = await Product.find().lean();
            socket.emit('sentProducts', products);
        })
        
        socket.on('addProduct', async productToAdd => { 
            await Product.create(productToAdd);
            const products = await Product.find().lean();
            socket.emit("sentProducts", products);
        })
        
        socket.on('productToDelete', async productIdDelete => {
            await Product.findByIdAndDelete(productIdDelete)
            const products = await Product.find().lean();
            socket.emit("sentProducts", products);
        })

        //Chat app

        socket.on('loadMessages', async () => {
            const arrayMessages = await Message.find();
            socket.emit('messages', arrayMessages)
        })
        
        socket.on('sentMessage', authUser, async info => {
            const { userEmail, message } = info;
            await Message.create({
                userEmail,
                message
            })
        
            const arrayMessages = await Message.find();
            socket.emit('messages', arrayMessages)
        })
    })

}