const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

const options = {
  usernameField: 'email',
  session: false,
};

passport.use(new LocalStrategy(options, async (email, password, done) => {
  try{
    const customer = await Customer.findOne({email: email});
    
    if(!customer){
      return done(null, false);
    }

    if(!customer.validatePassword(password)){ 
      return done(null, false);
    }

    return done(null, customer);

  }catch(error){
    return done(error);
  }
}));