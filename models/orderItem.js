const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const orderItemSchema = new Schema({
  orderId: { type: ObjectId, ref: 'Order', required: true },
  productId: { type: ObjectId, ref: 'Product', required: true },
  variants: { type: Object } ,
  price: { type: Number, required: true },
}, { timestamps: true });

// Set order Item price
orderItemSchema.pre('save', async () => {
  const product = await Product.findById({id: this.productId});
  this.price = product.price;
});

module.exports = mongoose.model('Order', orderItemSchema);