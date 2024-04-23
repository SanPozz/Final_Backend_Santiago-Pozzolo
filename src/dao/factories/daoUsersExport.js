import { configENV } from "../../config/configDotEnv.js";

const persistence = configENV.PERSISTENCE;

export let DAO

switch (persistence) {
    case "MONGO":
        let {UsersMongoDAO} = await import("../UsersMongoDAO.js")
        DAO = UsersMongoDAO
        break;

    case "FS":
        let {UsersFileSystemDAO} = await import("../UsersFileSystemDAO.js")
        DAO = UsersFileSystemDAO
        break;

    default:
        break;
}