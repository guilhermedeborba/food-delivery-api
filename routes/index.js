const router = require('express').Router();

router.use('/customers', require('./customers.js'));
router.use('/products', require('./products.js'));
router.use('/orders', require('./orders.js'));

module.exports = router;