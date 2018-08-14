const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = mongoose.model('Product');
const ObjectId = Schema.Types.ObjectId;

// Order Item Schema
const orderItemSchema = new Schema({
  productId: { type: ObjectId, ref: 'Product' },
  title: { type: String },
  price: { type: Number },
  variants: [
    { type: Object, required: false }
  ],
}, { _id: false });

// Set Order Item price before save
orderItemSchema.pre('save', async function(){
  const product = await Product.findById({_id: this.productId});
  this.price = product.basePrice;
  this.title = product.title;
});

// Order Schema
const OrderSchema = new Schema({
  customerId: { type: ObjectId, ref: 'Customer', required: false},
  status: { type: String, enum: ['pending', 'delivered'], required: true},
  totalPrice: { type: Number, required: true },
  items: [ 
    { type: orderItemSchema, required: true }
  ],
  shippingPrice: { type: Number, required: true },
  shippingAdress: { 
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
}, { timestamps: true });

// Set Order totalPrice before save
OrderSchema.pre('save', async function(){
  this.totalPrice = this.items.map(item => item.price)
  .reduce((itemPrice, totalPrice) => totalPrice + itemPrice, 0); 
});

module.exports = mongoose.model('Order', OrderSchema);