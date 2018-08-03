const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const OrderSchema = new Schema({
  customerId: { type: ObjectId, ref: 'Customer', required: true },
    // list: [
    //     // Product
    //     {  
    //         qty: { type: Number, required: true, default: 1 },
    //         productId: { type: ObjectId, ref: 'Product', required: true},
    //         preferences: { type: Object, required: true },
    //         note: { type: String, required: false },
    //         price: { type: Number, required: true }  
    //     },
    // ],
  status: { type: String, enum: ['pending', 'delivered'], required: true},
  totalPrice: { type: Number, required: true },
  totalQty: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  shippingAdress: { 
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);