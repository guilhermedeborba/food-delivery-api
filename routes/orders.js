const router = require('express').Router();
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

// Guest posting route
router.post('/orders/',  async (req, res) => {
  try{
    const order = await Order.create(req.body);
    res.status(200).json(order);
  }catch(error){
    res.status(500).json(error);
  }
});

module.exports = router;