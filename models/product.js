const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  basePrice: { type: Number, required: true },
  image: [ { type: String } ],
  //  
  variants: [ { type: Object, required: true } ],
  status: { type: String, required: true, enum: ['available','unavailable'], default: 'available' },
  expiryDate: { type: Date, required: false},
}, { timestamps: true });


// Product Methods

ProductSchema.methods.isExpired  = function(){
  if(this.createdAt >= this.expiryDate)
    return true;
  return false;
}


module.export = mongoose.model('Product', ProductSchema);