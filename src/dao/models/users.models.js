import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    rol: {
        type:String,
        default:'user'
    },
    user_cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        unique: true,
        required: true,
    },
    last_connection: {
        type: String,
        default: ""
    },
    documents: [
        {
        type: String,
        reference: String
        }
    ]   
});

const User = model('users', userSchema);
export default User