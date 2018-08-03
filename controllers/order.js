const mongoose = require('mongoose');
const Order = mongoose.model('Order');

module.exports = {
  listAll: async (req, res) => {  
    try{
      const orders = await Order.find({});
      res.status(200).json(orders);
    }catch(error){
      res.status(500).json(error);
    }
  },
  create: async (req, res) => {
    try{
      const order = await Order.create(req.body);
      res.status(200).json(order);
    }catch(error){
      res.status(500).json(error);
    }
  }
}