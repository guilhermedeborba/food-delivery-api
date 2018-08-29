const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Product = mongoose.model('Product');

// Redis client
const redisClient = require('../config/redis.js');

// Util function
const findByIdCached = require('./util.js');

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

OrderSchema.pre('save', async function () {
  try {
    // Get all product items schema
    const productsSchema = await this.getOrderItemsSchema();

    // Validating
    // Pricing

  } catch (error) {
    console.log(error);
  }
});

/*
  Look for each item productId and 
  insert them in array, then look for each 
  product by Id in cache or in the main db.
*/
OrderSchema.methods.getOrderItemsSchema = function () {
  const items = this.items;
  let productIds = [];

  // Look for different productIds and include them
  items.forEach(item => {
    // Include ObjectId if it is not in array yet
    if (!productIds.include(item.productId)) {
      productIds.push(item.productId);
    }
  });

  // For each productId find in cache or db
  return Promise.all(productIds.map(id => {
    new Promise((resolve, reject) => {
      findByIdCached(redisClient, Product, id, (error, product) => {
        if(error) reject(error);
        else{
          resolve(product);
        }
      });
    });
  }))
}

module.exports = mongoose.model('Order', OrderSchema);