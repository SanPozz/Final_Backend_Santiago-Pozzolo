import Cart from "./models/carts.models.js";

export class CartsMongoDAO {
    async createCart() {
        return await Cart.create({
            products: [],
        });
    }

    async getCartByID(cid) {
        return await Cart.findById(cid);
    }

    async getCartByIDAndUpdate(cid, data) {
        return await Cart.findByIdAndUpdate(cid, { $set: data }, { new: true });
    }

    async getCartByIDAndPopulate(cid) {
        return await Cart.findById(cid).populate('products.product_id');
    }

}