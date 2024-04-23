
import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String, 
        unique: true
    },
    purchase_datetime: {
        type: String 
    },
    amount: {
        type: Number 
    },
    purchaser: {
        type: String 
    },
    productsPurchased: {
        type: [
            {
                product_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number
                }
            }
        ]
    },
    productsNotPurchased: {
        type: [
            {
                product_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number
                }
            }
        ]
    }

})

const Ticket = model('tickets', ticketSchema);
export default Ticket