
import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String, // generatedcode
        unique: true
    },
    purchase_datetime: {
        type: String //datetime
    },
    amount: {
        type: Number //total
    },
    purchaser: {
        type: String //email
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