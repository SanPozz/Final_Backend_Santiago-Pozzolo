import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
	products: {
		type: [
			{
				product_id: {
					type: Schema.Types.ObjectId,
					ref: 'products',
				},
				quantity: {
					type: Number,
				},
			},
		],
	}
});

const Cart = model('carts', cartSchema);

export default Cart;