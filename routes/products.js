const router = express.Router();
const express = require('express');
const Product = require('../controllers/product.js');

router.get('/', Product.listAll);

router.get('/:id', Product.listOne);

router.post('/', Product.create);

router.put('/', Product.update);

router.delete('/:id', Product.delete);

module.exports = Router;