import { DAO } from "../dao/factories/daoProductsExport.js"

class ProductsService{
    constructor(dao){
        this.dao = new dao()
    }

    async getPaginatedProducts(query, options){
        return await this.dao.getPaginatedProducts(query, options)
    }

    async getProductByID(pid){
        return await this.dao.getProductByID(pid)
    }

    async createProduct(product){
        return await this.dao.createProduct(product)
    }

    async updateProduct(pid, product){
        return await this.dao.updateProduct(pid, product)
    }

    async deleteProduct(pid){
        return await this.dao.deleteProduct(pid)
    }
}

export const productService = new ProductsService(DAO)