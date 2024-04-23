import { DAO } from "../dao/factories/daoUsersExport.js"

class UsersService{
    constructor(dao){
        this.dao = new dao()
    }

    async createUser(user){
        return await this.dao.createUser(user)
    }

    async getUserByEmail(email){
        return await this.dao.getUserByEmail(email)
    }

    async getUserByEmailandLean(email){
        return await this.dao.getUserByEmailandLean(email)
    }

    async getUsers(){
        return await this.dao.getUsers()
    }

    async deleteUser(email){
        return await this.dao.deleteUser(email)
    }

    async updateUser(email, user){
        return await this.dao.updateUser(email, user)
    }
}

export const userService = new UsersService(DAO)