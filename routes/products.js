const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

/* 
  @route  POST api/v1/products
  @desc   List Products
  @access Public
*/
router.get('/', async (req, res) => {
  try{
    const products = await Product.find(req.query);

    if(!products.length){
      res.status(404).json({error: 'Resource not found'});
    }else{
      res.status(200).json(products);
    }
  }catch(error){
    res.status(500).json(error);
  }
});

/* 
  @route  POST api/v1/customers
  @desc   List one Product by slug
  @access Public
*/
router.get('/:slug', async (req, res) => {
  try{
    const product = await Product.findOne({title: req.params.slug});

    if(!product){
      res.status(404).json({error: 'Resource not found'});
    }else{
    res.status(200).json(product);
    }
  }catch(error){
    res.status(500).json(error);
  }
});

// * Admin * Create product
router.post('/', async (req, res) => {
	try{
    const newProduct = await Product.create(req.body);
		res.status(200).json(newProduct);
	}catch(error){
		res.status(500).json(error);
	}
});

module.exports = router;