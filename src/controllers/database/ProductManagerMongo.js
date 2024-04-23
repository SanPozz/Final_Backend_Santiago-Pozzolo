import { productService } from "../../services/products.service.js";
import { CustomError, ErrorCodes, logger } from "../../utils.js";
import mongoose from "mongoose";

export class ProductManagerMongo {
    constructor(){}

    static async getProducts(req, res) {
        const { limit, page, sort, category, status } = req.query;
    
        try {
            let query = {};
    
            category && (query.category = category)
            status && (query.status = status)
            
            let options = {
                limit: limit || 10,
                page: page || 1,
                lean: true
            }
    
            sort && (options.sort = { price: sort})
    
            const products = await productService.getPaginatedProducts(query, options);

            if (!products) {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
            }
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(products);
    
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async getProductByID(req, res) {
        const { pid } = req.params;
    
        try {

            const product = await productService.getProductByID(pid);

    
            if (product) {
                res.send(product);

            } else {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
            }
    
        } catch (error) {
            logger.error(error)
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async createProduct(req, res) {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        const owner = req.user.email
    
        try {
            const productToAdd = {
                title,
                description,
                category,
                stock,
                code,
                thumbnail,
                price,
                owner: owner
            };

            await productService.createProduct(productToAdd);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: "Product Created: " + productToAdd });

        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(500).send({ Error: "Error creating product: " + error});
        }
    }

    static async updateProduct(req, res) {
        try {
            
            const { pid } = req.params;
            const { title, description, stock, code, price, category } = req.body;
            let productToUpdate

            if (!title || !description || !stock || !code || !price || !category) {
                throw new CustomError(ErrorCodes.MISSING_PARAMETERS.message, ErrorCodes.MISSING_PARAMETERS.name, ErrorCodes.MISSING_PARAMETERS.code);
            }

            const product = await productService.getProductByID(pid);

            if (!product) {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
            }

            const user = req.user

            if(!user) {
                throw new CustomError(ErrorCodes.UNAUTHORIZED.message, ErrorCodes.UNAUTHORIZED.name, ErrorCodes.UNAUTHORIZED.code);
            }

            if (user.rol == 'premium') {
                if (product.owner != user.email) {
                    throw new CustomError(ErrorCodes.UNAUTHORIZED.message, ErrorCodes.UNAUTHORIZED.name, ErrorCodes.UNAUTHORIZED.code);
                }

                productToUpdate = {
                    title: title,
                    description: description,
                    stock: stock,
                    code: code,
                    price: price,
                    category: category,
                };
            } else if (user.rol == 'admin') {

                productToUpdate = {
                    title: title,
                    description: description,
                    stock: stock,
                    code: code,
                    price: price,
                    category: category,
                };
            } else {
                throw new CustomError(ErrorCodes.UNAUTHORIZED.message, ErrorCodes.UNAUTHORIZED.name, ErrorCodes.UNAUTHORIZED.code);
            }


            const productUpdated = await productService.updateProduct(pid, productToUpdate);

            if (productUpdated) {
                logger.info({productUpdated})
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({ status: "Product Updated: " + productToUpdate });
            } else {
                throw new CustomError(ErrorCodes.INTERNAL_SERVER_ERROR.message, ErrorCodes.INTERNAL_SERVER_ERROR.name, ErrorCodes.INTERNAL_SERVER_ERROR.code);
            }
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async deleteProduct(req, res) {
        const { pid } = req.params;

        try {

            const user = req.user
            let productToDelete

            if (user.rol == 'admin' || user.rol == 'premium') {

                if (user.rol == 'premium') {
                    const product = await productService.getProductByID(pid);

                    if (!product) {
                        throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
                    }

                    if (product.owner != user.email) {
                        throw new CustomError(ErrorCodes.INVALID_PRODUCT_ID.message, ErrorCodes.INVALID_PRODUCT_ID.name, ErrorCodes.INVALID_PRODUCT_ID.code);
                    }

                    productToDelete = await productService.deleteProduct(pid);
                }

                if (user.rol == 'admin') {
                    productToDelete = await productService.deleteProduct(pid);
                }
                
                if (productToDelete) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send({ status: "Product Deleted: " + productToDelete })
                } else {
                    throw new CustomError(ErrorCodes.INTERNAL_SERVER_ERROR.message, ErrorCodes.INTERNAL_SERVER_ERROR.name, ErrorCodes.INTERNAL_SERVER_ERROR.code);
                }

            } else { 
                throw new CustomError(ErrorCodes.UNAUTHORIZED.message, ErrorCodes.UNAUTHORIZED.name, ErrorCodes.UNAUTHORIZED.code);
            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }
}