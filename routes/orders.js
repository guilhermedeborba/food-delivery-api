const router = require('express').Router();
const Order = require('../controllers/order.js');

// Create new order
router.post('/', Order.create);

// List all orders
router.get('/', Order.listAll);

module.exports = router;