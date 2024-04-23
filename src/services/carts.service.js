import { DAO } from "../dao/factories/daoCartsExport.js"

class CartsService{
    constructor(dao){
        this.dao = new dao()
    }

    async createCart(){
        return await this.dao.createCart()
    }

    async getCartByID(cid){
        return await this.dao.getCartByID(cid)
    }

    async getCartByIDAndUpdate(cid, data){
        return await this.dao.getCartByIDAndUpdate(cid, data)
    }

    async getCartByIDAndPopulate(cid){
        return await this.dao.getCartByIDAndPopulate(cid)
    }

}

export const cartService = new CartsService(DAO)