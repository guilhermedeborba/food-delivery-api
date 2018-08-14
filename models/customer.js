const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// Customer Schema
const CustomerSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  password: { type: String },
  salt: { type: String },
}, { timestamps: true });

// Look for duplicate entries 
// and report them like any other validation error
CustomerSchema.plugin(uniqueValidator, { message: 'You are already registered.' });

// Hash the password before save
CustomerSchema.pre('save', function(next){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 512, 'sha512').toString('hex');
  next(); 
});

/* 
    Customer Methods
*/

CustomerSchema.methods.toProfileJSONFor = function(){
	return {
    address: this.address,
    name: this.name,
    email: this.email,
  }
};

CustomerSchema.methods.validatePassword = function(password){
  const hashedPassword = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.password === hashedPassword;
};

CustomerSchema.methods.generateJWT = function(){
  return jwt.sign({
    id: this._id,
    email: this.email,
    expiresIn: '1h', 
  }, process.env.JWT_SECRET);
};

CustomerSchema.methods.toAuthJSON = function(){
  return {
    email: this.email,
    token: this.generateJWT(),  
  };
}

module.exports = mongoose.model('Customer', CustomerSchema);