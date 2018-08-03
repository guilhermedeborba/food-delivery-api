const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  password: { type: String },
  salt: { type: String },
}, { timestamps: true });


// the unique validator will check for duplicate database entries 
// and report them like any other validation error
CustomerSchema.plugin(uniqueValidator, { message: 'You are already registered.' });

// Hashing password
CustomerSchema.pre('save', function(next){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 512, 'sha512').toString('hex');
  next();
});


// Customer Methods

CustomerSchema.methods.toProfileJSONFor = function(){
	return {
    address: this.address,
    firstName: this.firstName,
    email: this.email,
  }
};

// Validate the password
CustomerSchema.methods.validPassword = function(input){
  const hashedInput = crypto.pbkdf2Sync(input, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.password === hashedInput;
};


CustomerSchema.methods.generateJWT = function(){
  jwt.sign({
    id: this._id,
    email: this.email,
    expiresIn: '1h', 
  });
};

CustomerSchema.methods.toAuthJSON = function(){
  return {
    email: this.email,
    token: this.generateJWT(),  
  };
}

module.exports = mongoose.model('Customer', CustomerSchema);