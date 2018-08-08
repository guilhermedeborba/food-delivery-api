const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  totalPrice: { type: Number },
  images: [ { type: String } ],
  /*
        Variants are selectable fields about the product.
  */
  variants: [ { type: Object } ],
  // status: { type: String, enum: ['available', 'unavailable'], required: true},
  expiryDate: { type: Date, required: false },
}, { timestamps: true });


module.export = mongoose.model('Product', ProductSchema);