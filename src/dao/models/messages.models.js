import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const Message = model('messages', messageSchema);

export default Message