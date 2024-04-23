import dotenv from "dotenv"
import { Command } from "commander";

const selectDAO = new Command();

selectDAO
    .option("-t, --type <type>", "Select the type of database", "MONGO")
selectDAO.parse()

let persistence = selectDAO.opts().type.toUpperCase();

dotenv.config({
    path: "./src/.env"
})

export const configENV = {
    MONGO_URL: process.env.MONGO_URL,
    SECRET_CODERH_PASS: process.env.SECRET_CODERH_PASS,
    PORT: process.env.PORT,
    PERSISTENCE: persistence || MONGO,
    SECRET_JWT: process.env.SECRET_JWT,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER
}