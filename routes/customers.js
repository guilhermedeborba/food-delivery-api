const router = require('express').Router();
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const Order = mongoose.model('Order');
const auth = require('./auth.js');
const passport = require('passport');

// Create a new customer
router.post('/', async (req, res) => {
	try{
    const newCustomer = await Customer.create(req.body);
		res.status(200).json(newCustomer);
	}catch(error){
		res.status(500).json(error);
	}
});

// Auth an user and Generates a token for access
router.post('/auth', (req, res, next) => {
  if(!req.body.email){
    return res.status(422).json({errors: {email: 'cant be blank'}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: 'cant be blank'}});
  }

  passport.authenticate('local', {session: false}, function(err, customer, info){
    if(err){ return next(err); }

    if(customer){
      customer.token = customer.generateJWT();
      return res.json(customer.toAuthJSON());
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

// List one customer
router.get('/', auth.required, async (req, res) => {
  try{
    const customer = await Customer.findById(req.payload.id);
	  res.status(200).json(customer.toProfileJSONFor());
  }catch(error){
	  res.status(500).json(error);
  }
});

// List a customer's orders
router.get('/orders', auth.required, async (req, res) => {
  try{
    const orders = await Order.find({customerId:req.payload.id, status: req.query.status});
    res.status(200).json(orders);
  }catch(error){
    res.status(500).json(error);
  }
});

// Post a customer's orders
router.get('/orders', auth.required, async (req, res) => {
  try{
    const order = await Order.create(req.body);
    res.status(200).json(order);
  }catch(error){
    res.status(500).json(error);
  }
});

// Update a customer
router.put('/', auth.required, async (req, res) => {
  try{
    const customerChanged = await Customer.update(req.payload.id, req.body);
	  res.status(200).json(customerChanged);
  }catch(error){
	  res.status(500).json(error);
  }
});

module.exports = router;