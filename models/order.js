const mongoose = require('mongoose');
const orderItem = mongoose.model('orderItem');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const OrderSchema = new Schema({
  customerId: { type: ObjectId, ref: 'Customer', required: false},
  status: { type: String, enum: ['pending', 'delivered'], required: true},
  totalPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  shippingAdress: { 
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
}, { timestamps: true });

OrderSchema.pre('save', async () => {
  const items = await orderItem.find({orderId: this.id});

  this.totalPrice = items.map(item => item.price)
                         .reduce((itemPrice, totalPrice) => totalPrice + itemPrice, 0);
});

module.exports = mongoose.model('Order', OrderSchema);