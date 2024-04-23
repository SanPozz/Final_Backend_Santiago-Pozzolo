import User from "./models/users.models.js";

export class UsersMongoDAO {

    async createUser(user) {
        return await User.create(user)
    }
    
    async getUserByEmail(emailParam) {
        return await User.findOne({ email: emailParam })
    }

    async getUserByEmailandLean(emailParam) {
        return await User.findOne({ email: emailParam }).lean()
    }

    async getUsers() {
        return await User.find()
    }

    async deleteUser(emailParam) {
        return await User.deleteOne({ email: emailParam })
    }

    async updateUser(emailParam, user) {
        return await User.findOneAndUpdate({ email: emailParam }, user)
    }
}