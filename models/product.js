const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  images: [{ type: String }],
  variants: { type: Object },
  // status: { type: String, enum: ['available', 'unavailable'], required: true},
  expiryDate: { type: Date, required: false },
}, { timestamps: true });


module.exports = mongoose.model('Product', ProductSchema);