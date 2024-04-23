import { Command } from "commander";
import { cartService } from "../services/carts.service.js";
import { userService } from "../services/users.service.js";

const program = new Command();

program
  .option("-n, --name <name>", "Name of the user")
  .option("-l, --lastname <lastname>", "Lastname of the user")
  .option("-e, --email <email>", "Email of the user")
  .option("-p, --password <password>", "Password of the user")
  .option("-a, --age <age>", "Age of the user")
  .parse(process.argv);

const { name, lastname, email, password, age } = program.opts();

if (!name || !lastname || !email || !password || !age) {
  console.log("All fields are required");
  process.exit(1);
}

async function createUser() {
  try {
    const userCart = await cartService.createCart();

    const user = {
      first_name: name,
      last_name: lastname,
      email: email,
      password: password,
      age: age,
      rol: "admin",
      user_cart: userCart._id,
    };

    await userService.createUser(user);
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    process.exit(1);
  }
}

createUser();