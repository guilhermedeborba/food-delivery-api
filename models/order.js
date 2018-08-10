const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = mongoose.model('Product');
const ObjectId = Schema.Types.ObjectId;

const productVariantSchema = new Schema({
  productId: { type: ObjectId, ref: 'Product' },
});

const orderItemSchema = new Schema({
  productId: { type: ObjectId, ref: 'Product' },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  variants: [
    { type: productVariantSchema, required: false }
  ],
});

// Set order Item price
orderItemSchema.pre('save', async function(){
  const product = await Product.findById({id: this.productId});
  this.price = product.basePrice;
});

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

// Set order total price
OrderSchema.pre('save', async function(){
  const items = await orderItem.find({orderId: this.id});

  this.totalPrice = items.map(item => item.price)
  .reduce((itemPrice, totalPrice) => totalPrice + itemPrice, 0); 
});

module.exports = mongoose.model('Order', OrderSchema);