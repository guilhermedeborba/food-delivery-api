const router = require('express').Router();
const Customer = require('../controllers/customer.js');
const auth = require('./auth.js');

// Register a new customer
router.post('/', Customer.register);

// Local login a new customer
router.post('/login', Customer.auth);

// * List all customers
router.get('/list-all', Customer.listAll);

// List one customer
router.get('/', Customer.listOneById);

// List all customer's orders
router.get('/:customerId/orders', Customer.listOrders);

// List a customer order
router.get('/:customerId/orders/:orderId', Customer.listOrderById);

// Update a customer
router.put('/:customerId', Customer.update);

// Delete a customer
router.delete('/:_id', Customer.delete);

module.exports = router;