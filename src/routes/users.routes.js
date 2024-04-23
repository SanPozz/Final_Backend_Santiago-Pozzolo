import { Router } from "express";

import { authorizationStrategy, checkRol } from "../utils.js";

import { UsersControllerMongo } from "../controllers/database/UsersControllerMongo.js";

const routerUsers = Router();

routerUsers.post('/premium/:uid', authorizationStrategy('jwt', { session: false }), checkRol(['user', 'premium']), UsersControllerMongo.updateRol);

export default routerUsers