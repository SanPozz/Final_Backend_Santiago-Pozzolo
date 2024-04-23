import { Router } from "express";

import { CartManagerMongo } from "../controllers/database/CartManagerMongo.js";

import { authorizationStrategy } from "../utils.js";

const routerCarts = Router();

routerCarts.post('/', CartManagerMongo.createCart)

routerCarts.get('/:cid', CartManagerMongo.getCartByID)

routerCarts.post('/:cid/products/:pid', authorizationStrategy('jwt', { session: false }), CartManagerMongo.pushProductToCart)

routerCarts.delete('/:cid', CartManagerMongo.cleanCart)

routerCarts.delete('/:cid/products/:pid', authorizationStrategy('jwt', { session: false }), CartManagerMongo.deleteProductFromCart)

routerCarts.put('/:cid', CartManagerMongo.updateFullCart)

routerCarts.put('/:cid/products/:pid', CartManagerMongo.updateProductQuantity)

routerCarts.post('/:cid/purchase', authorizationStrategy('jwt', { session: false }), CartManagerMongo.completePurchase)

export default routerCarts