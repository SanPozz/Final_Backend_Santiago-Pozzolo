import { configENV } from "../../config/configDotEnv.js";

const persistence = configENV.PERSISTENCE;

export let DAO

switch (persistence) {
    case "MONGO":
        let {TicketsMongoDAO} = await import("../TicketsMongoDAO.js")
        DAO = TicketsMongoDAO
        break;

    case "FS":
        let {TicketsFileSystemDAO} = await import("../TicketsFileSystemDAO.js")
        DAO = TicketsFileSystemDAO
        break;

    default:
        break;
}