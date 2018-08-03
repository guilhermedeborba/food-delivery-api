const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

passport.use(new LocalStrategy( async (email, password, done) => {
  try{
    const customer = await Customer.findOne({ email: email});

    if(!customer.validPassword(password)){
       return done(null, false);
    }

    return done(null, customer);

  }catch(error){
    return done(error);
  }
}));