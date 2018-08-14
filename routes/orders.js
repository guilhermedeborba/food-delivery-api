const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

/* 
  @route  POST api/v1/orders
  @desc   Create an Order
  @access Public
*/
router.post('/orders/',  async (req, res) => {
  try{
    const order = await Order.create(req.body);
    res.status(200).json(order);
  }catch(error){
    res.status(500).json(error);
  }
});

module.exports = router;