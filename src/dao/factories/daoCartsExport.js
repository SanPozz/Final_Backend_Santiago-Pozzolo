import { configENV } from "../../config/configDotEnv.js";

const persistence = configENV.PERSISTENCE;

export let DAO

switch (persistence) {
    case "MONGO":
        let {CartsMongoDAO} = await import("../CartsMongoDAO.js")
        DAO = CartsMongoDAO
        break;

    case "FS":
        let {CartsFileSystemDAO} = await import("../CartsFileSystemDAO.js")
        DAO = CartsFileSystemDAO
        break;

    default:
        break;
}