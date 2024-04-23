import { promises as fs } from 'fs'

class CartManager {

    constructor(cartsPath, productsPath) {
        this.carts = [];
        this.cartsPath = cartsPath;
        this.productsPath = productsPath;
    }

    async createCart() {
        try {
            this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));

            const newCart = {
                id: this.getNewCartId(),
                products: []
            }

            this.carts.push(newCart);

            await fs.writeFile(this.cartsPath, JSON.stringify(this.carts, null, 4));
            console.log('Carrito Creado Correctamente');
            return true

            } catch (error) {
                console.log(error);
                return error
            }
    }

    async getProductsByCart(cid) {
        try {
            
            this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));

            const cartFound = this.carts.find(cart => cart.id == cid);
            const cartProducts = cartFound.products;

            if (cartFound) {
                console.log(cartProducts);
                return cartProducts
            } else {
                return false
            }

        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));
            const products = JSON.parse(await fs.readFile(this.productsPath, 'utf-8'));

            const product = products.find(prod => prod.id === pid);
            const cart = this.carts.find(cart => cart.id === cid);

            const productExist = cart.products.find(prod => prod.id === pid);

            if (!product) {
                throw new Error('Product not found');
            }

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (productExist) {
                productExist.quantity++;
                await fs.writeFile(this.cartsPath, JSON.stringify(this.carts, null, 4));
                return true
            } else {
                cart.products.push({ id: product.id, quantity: 1 });
                await fs.writeFile(this.cartsPath, JSON.stringify(this.carts, null, 4));

                console.log('Product added to cart');
                return true;
            }
            } catch (error) {
                console.log(error);
                return error
            }

    }

    getNewCartId() {
        const highestId = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
        return highestId + 1;
    }
}

export default CartManager