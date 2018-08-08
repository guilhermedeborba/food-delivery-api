const express = require('express');
const router = express.Router();
const Product = require('../controllers/products.js');

router.get('/', Product.listAll);

router.get('/:id', Product.listOne);

router.post('/', Product.create);

router.put('/', Product.update);

router.delete('/:id', Product.delete);

module.exports = Router;