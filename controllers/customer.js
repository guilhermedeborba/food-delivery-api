const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const passport = require('passport');


exports.register = async (req, res) => {
  try{
    const newCustomer = await Customer.create(req.body);
    res.status(200).json(newCustomer);
  }catch(error){
    res.status(500).json(error);
  }
}

exports.auth = (req, res, next) => {
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }
 
   if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', { session: false }, (err, customer, info) => {
    if(err){ return next(err); }

    if(customer){
      customer.token = Customer.generateJWT();
      return res.status(200).json(customer.toAuthJSON());
    }else {
       return res.status(422).json(info);
    }
  })(req, res, next);  
}

exports.listAll = async (req, res) => {
  try{
    const customers = await Customer.find({});
    res.status(200).json(customers);
  }catch(error){
    res.status(500).json(error);
  }
}

exports.listOneById = async (req, res) => {
  try{
    const customer = await Customer.findById({_id: req.payload.id});
    res.status(200).json(customer.toAuthJSON());
  }catch(error){
    res.status(401).json(error);
  }
}

exports.listOrders = async (req, res) => {
  try{
    const orders = await Order.find({customerId:req.params, status: req.query.status || null});
    res.status(200).json(orders);
  }catch(error){
    res.status(500).json(error);
  }
}

exports.listOrderById = async (req, res) => {
  try{
    const order = await Order.find({_id: req.params});
    res.status(500).json(order);
  }catch(error){
    res.status(500).json(error);
  }
}

exports.update = async (req, res) => {
  try{
    const customer = await Customer.update(req.params, req.body);
    res.status(200).json(customer);
  }catch(error){
    res.status(500).json(error);
  }
}

exports.delete = async (req, res) => {
  try{
    const customer = await Customer.remove(req.params);
    res.status(200).json(customer);
  }catch(error){
    res.status(500).json(error);
  }
}
