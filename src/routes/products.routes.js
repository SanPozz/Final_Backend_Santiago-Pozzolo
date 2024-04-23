import { Router } from "express";

import passport from "passport";

import { ProductManagerMongo } from "../controllers/database/ProductManagerMongo.js";

import { checkRol, authorizationStrategy } from "../utils.js";

const routerProducts = Router();


routerProducts.get('/', ProductManagerMongo.getProducts)

routerProducts.get('/:pid', ProductManagerMongo.getProductByID)

routerProducts.post('/', authorizationStrategy('jwt', { session: false }), checkRol(['admin', 'premium']), ProductManagerMongo.createProduct)

routerProducts.put('/:pid', authorizationStrategy('jwt', { session: false }), checkRol(['admin', 'premium']), ProductManagerMongo.updateProduct)

routerProducts.delete('/:pid', authorizationStrategy('jwt', { session: false }), checkRol(['admin', 'premium']), ProductManagerMongo.deleteProduct)

export default routerProducts