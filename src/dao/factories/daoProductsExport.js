import { configENV } from "../../config/configDotEnv.js";

const persistence = configENV.PERSISTENCE;

export let DAO

switch (persistence) {
    case "MONGO":
        let {ProductsMongoDAO} = await import("../ProductsMongoDAO.js")
        DAO = ProductsMongoDAO
        break;

    case "FS":
        let {ProductsFileSystemDAO} = await import("../ProductsFileSystemDAO.js")
        DAO = ProductsFileSystemDAO
        break;

    default:
        break;
}