import __dirname from './path.js';
import path from 'path';

import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { engine } from 'express-handlebars';


import routerProducts from './routes/products.routes.js';
import routerTickets from './routes/tickets.routes.js';
import routerCarts from './routes/carts.routes.js';
import routerSessions from './routes/sessions.routes.js';
import routerMailing from './routes/mailing.routes.js';
import routerUsers from './routes/users.routes.js';
import viewsRouter from './routes/views.routes.js';

import { initializatePassport } from './config/passportConfig.js';
import passport from 'passport';

import cookieParser from 'cookie-parser';

import { configENV } from "./config/configDotEnv.js"
import { SingletonDB } from './config/SingletonDB.js';
import { addLogger, logger } from './utils.js';
import { initializeSocket } from './config/socketIO.js';

const app = express();
const PORT = configENV.PORT;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);


initializatePassport();
app.use(passport.initialize());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Proyecto Final Backend',
            version: '1.0.0',
            description:"Documentacion API Proyecto Final Backend hecho por Santiago Pozzolo"
        }
    },
    apis: [`${path.join(__dirname, '/docs/**/*.yaml')}`]
}

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));


app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/sessions', routerSessions);
app.use('/api/mailing', routerMailing);
app.use('/api/users', routerUsers);
app.use('/api/tickets', routerTickets);
app.use('/', viewsRouter);

export const server = app.listen(PORT, () => {
    logger.info(`Server on Port: ${PORT}`);
})

initializeSocket(server)

SingletonDB.connectDB(configENV.MONGO_URL);