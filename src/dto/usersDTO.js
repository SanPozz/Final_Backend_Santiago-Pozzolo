export class UserReadDTO{
    constructor(user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.rol = user.rol
        this.age = user.age
        this.user_cart = user.user_cart
    }

    static getUserDTO(user) {
        return{
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        rol: user.rol,
        age: user.age,
        user_cart: user.user_cart
    }

    }
}