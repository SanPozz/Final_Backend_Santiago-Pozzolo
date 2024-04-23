import { Router } from "express";

import passport from "passport";

import { SessionsManagerMongo } from "../controllers/database/SessionsManagerMongo.js";

import { authorizationStrategy, checkRol } from "../utils.js";

const routerSessions = Router();

routerSessions.post('/register', SessionsManagerMongo.register);

routerSessions.post('/login', SessionsManagerMongo.login);

routerSessions.get('/logout', authorizationStrategy('jwt', { session: false }), SessionsManagerMongo.logout)

routerSessions.get('/github', passport.authenticate('github', {}), async (req, res) => {});

routerSessions.get('/callbackGithub', passport.authenticate('github', {failureRedirect: '/login', session: false}), SessionsManagerMongo.callbackGithub)

routerSessions.get("/current", authorizationStrategy('jwt', { session: false }), SessionsManagerMongo.current);

routerSessions.post('/recoverpassword', SessionsManagerMongo.resetPassword);

export default routerSessions