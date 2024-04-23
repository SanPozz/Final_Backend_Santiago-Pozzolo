import { Command } from "commander";
import {cartService} from "../services/carts.service.js";
import {userService} from "../services/users.service.js";

const createUserAdmin = new Command("add-admin-user")
    .description("Add an admin user");

createUserAdmin
    .option("-n, --name <name>", "Name")
    .option("-l, --lastname <lastname>, Lastname")
    .option("-e, --email <email>", "Email")
    .option("-p, --password <password>", "Password")
    .option("-a, --age <age>", "Age")
    .action(async (name, lastname, email, password, age) => {
        try {

            const cart = await cartService.createCart();

            const cartId = cart._id;

            const user = {
                first_name: name,
                last_name: lastname,
                email: email,
                age: age,
                password: password,
                rol: 'admin',
                user_cart: cartId
            }
            await userService.createUser(user);
            console.log('User created successfully');
        } catch (error) {
            console.log(error);
        }
    })

createUserAdmin.parse();