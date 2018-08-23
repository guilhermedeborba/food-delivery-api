const router = require('express').Router();
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const Order = mongoose.model('Order');
const auth = require('./auth.js')
const passport = require('passport');


router.get('/test', (req, res) => {
  res.status(200).json(req.payload);
});


/* 
  @route  POST api/v1/customers
  @desc   Create a new customer
  @access Public
*/
router.post('/', async (req, res) => {
	try{
    const newCustomer = await Customer.create(req.body);
		res.status(200).json(newCustomer);
	}catch(error){
		res.status(500).json(errors);
	}
});

/* 
  @route  POST api/v1/customers/auth
  @desc   Auth customer and generates token
  @access Private
*/
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

/* 
  @route  GET api/v1/customers
  @desc   List the Customer authed
  @access Private
*/
router.get('/', auth, async (req, res) => {
  try{
    const customer = await Customer.findById(req.payload.id);
	  res.status(200).json(customer.toProfileJSONFor());
  }catch(error){
	  res.status(500).json(error);
  }
});

/* 
  @route  POST api/v1/customers/orders
  @desc   List customer's orders
  @access Private
*/
router.get('/orders', auth, async (req, res) => {
  try{
    const orders = await Order.find({customerId:req.payload.id, status: req.query.status});
    res.status(200).json(orders);
  }catch(error){
    res.status(500).json(error);
  }
});

/* 
  @route  POST api/v1/customers/orders
  @desc   Create a new Order
  @access Private
*/
router.post('/orders', auth, async (req, res) => {
  try{
    const order = await Order.create({customerId:req.payload.id, ...req.body});
    res.status(200).json(order);
  }catch(error){
    res.status(500).json(error);
  }
});

/* 
  @route  PUT api/v1/customers
  @desc   Update a Customer
  @access Private
*/
router.put('/', auth, async (req, res) => {
  try{
    const customerChanged = await Customer.update(req.payload.id, req.body);
	  res.status(200).json(customerChanged);
  }catch(error){
	  res.status(500).json(error);
  }
});

module.exports = router;