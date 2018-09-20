const { promisify } = require('util');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Product = mongoose.model('Product');

// Redis client
const redisClient = require('../config/redis.js');

// Util function
const Util = require('./util.js');
Util.findByIdCached = promisify(Util.findByIdCached);

// Order Item Schema
const orderItemSchema = new Schema({
  productId: { type: ObjectId, ref: 'Product' },
  title: { type: String },
  price: { type: Number },
  variants: { type: Object },
  additionals: { type: Object }
}, { _id: false });

// Order Schema
const OrderSchema = new Schema({
  customerId: { type: ObjectId, ref: 'Customer', required: false },
  status: { type: String, enum: ['pending', 'delivered'], required: true },
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

OrderSchema.pre('save', async function (next) {
  try {
    // Get all product items schema
    const productsSchemas = await this.getOrderItemsSchemas();

    // Pricing
  } catch (error) {
    next(error);
  }
});

//Look for each product by Id in cache or in the main db
OrderSchema.methods.getOrderItemsSchemas = function () {

  // Filter and return an array of unique values
  const productIds = Util.uniqueValues(this.items);

  // Find each product Schema in cache or db
  return Promise.all(productIds.map(id => {
    return Util.findByIdCached(redisClient, Product, id);
  }));
}


module.exports = mongoose.model('Order', OrderSchema);