import { userService } from "../../services/users.service.js";

export class UsersControllerMongo {
    constructor(){}

    static async updateRol(req, res) {
        const { uid } = req.params;
            try {
            const user = await userService.getUserById(uid);

            if (!user) {
                throw new Error('User not found');
            }

            if (user.rol == 'user') {
                user.rol = 'premium';
            } else if (user.rol == 'premium') {
                user.rol = 'user';
            }

            user.save();

            res.status(200).send("Rol de usuario actualizado");
            
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send({ error: error });
        }
    }
}