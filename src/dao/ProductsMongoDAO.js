import Product from "./models/products.models.js";

export class ProductsMongoDAO{

    async getPaginatedProducts(query, options){
        return await Product.paginate(query, options)
    }

    async getProductByID(pid){
        return await Product.findById(pid)
    }

    async createProduct(product){
        return await Product.create(product)
    }

    async updateProduct(pid, product){
        return await Product.findByIdAndUpdate(pid, product)
    }

    async deleteProduct(pid){
        return await Product.findByIdAndDelete(pid)
    }
}