import { cartService } from "../../services/carts.service.js";
import { productService } from "../../services/products.service.js";
import { CustomError, ErrorCodes } from "../../utils.js";
import { generateTicketCode, logger, transporter } from "../../utils.js";


export class CartManagerMongo {
    constructor(){}

    static async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart created successfully', cart: newCart });


        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: 'Error creating cart: ' + error });
        }
    }

    static async getCartByID(req, res) {
        const { cid } = req.params;
    
        try {

            const cart = await cartService.getCartByIDAndPopulate(cid);

    
            if (cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(cart);
            } else {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async pushProductToCart(req, res) {
    
        try {
            const { cid, pid } = req.params;

            const user = req.user

            const cart = await cartService.getCartByID(cid);
            const product = await productService.getProductByID(pid);

    
            if (!cart) {

                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }
    
            if (!product) {

                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
            }

            if (product.owner == user.email) {

                throw new CustomError(ErrorCodes.INVALID_PRODUCT_ID.message, ErrorCodes.INVALID_PRODUCT_ID.name, ErrorCodes.INVALID_PRODUCT_ID.code);
            }
    
            const productExist = cart.products.find(prod => prod.product_id == product.id)
    
            if (productExist) {

                productExist.quantity++

            } else {

                console.log(cart)
                cart.products.push({ product_id: product._id, quantity: 1 });
            }

            await cart.save();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Product added to cart successfully' + product._id });
    
        } catch (error) {
            logger.error(JSON.stringify(error))
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async cleanCart(req, res) {
        const { cid } = req.params;
    
        try {


            const cart = await cartService.getCartByID(cid);

            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

            cart.products = [];
            await cart.save();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart cleaned successfully' });
            
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async deleteProductFromCart(req, res) {
        const { cid, pid } = req.params;
    
        try {


            const cart = await cartService.getCartByID(cid);



            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }
    
            const productsFiltered = cart.products.filter(prod => prod.product_id != pid);
            cart.products = productsFiltered;

            await cart.save()

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: `Product with ${pid} was deleted` })

    
        } catch (error) {
            logger.error(JSON.stringify(error))
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async updateFullCart(req, res) {
        const { cid } = req.params;
        const { data } = req.body;

        try {


            const cart = await cartService.getCartByIDAndUpdate(cid, data);

            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart updated successfully', cart });
            
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async updateProductQuantity(req, res){
        const { cid, pid } = req.params;
        const { quantity } = req.body;
    
        try {
            
            const cart = await cartService.getCartByID(cid);

            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

            let productToUpdate = cart.products.find(prod => prod.id_prod == pid);
    
            productToUpdate.quantity = quantity;
            await cart.save();
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: "OK" , productToUpdate});
    
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async completePurchase(req, res){
        const { cid } = req.params;

        try {
            
            const cart = await cartService.getCartByID(cid);

            if (cart) {

                let total = 0;
                let productsPurchased = [];
                let productsNotPurchased = [];

                for (let i = 0; i < cart.products.length; i++) {
                    const element = cart.products[i];
                    const dbProduct = await productService.getProductByID(element.product_id.toString());
            
                    if (!dbProduct) {
                        throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
                    }

                    if (dbProduct.stock < element.quantity) {
                        productsNotPurchased.push({ product_id: element.product_id.toString(), quantity: element.quantity });
                    } else {
                        dbProduct.stock = dbProduct.stock - element.quantity;
                        await dbProduct.save();

                        total += dbProduct.price * element.quantity;
                        console.log(total);

                        productsPurchased.push({ product_id: element.product_id.toString(), quantity: element.quantity });
                    }
                }

            console.log("products not purchased: " + JSON.stringify(productsNotPurchased))
            console.log("products purchased: " + JSON.stringify(productsPurchased))

                
            if (productsNotPurchased.length > 0) {
                cart.products = productsNotPurchased;
                await cart.save();
            } else {

                cart.products = [];

                await cart.save();
            }

            if (productsPurchased.length < 0) {
                throw new CustomError(ErrorCodes.MISSING_PARAMETERS.message, ErrorCodes.MISSING_PARAMETERS.name, ErrorCodes.MISSING_PARAMETERS.code);
            }

            
            let ticketCode = generateTicketCode()

            const ticketToAdd = {
                code: ticketCode,
                purchase_datetime: new Date().toLocaleString(),
                amount: total,
                purchaser: req.user.email,
                productsPurchased: productsPurchased,
                productsNotPurchased: productsNotPurchased
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: "OK" , cart, ticketCode, ticketToAdd, productsPurchased, productsNotPurchased});


            } else {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: `Error: ${error}` });
        }
    }
}

