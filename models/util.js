/**
 * Validate product variants using its original schema
 * 
 * @param {orderItemSchema}
 * @param {Array} productsSchemas 
 */
function validateVariants({ variants, productId }, productsSchemas) {
  const productSchema = productsSchemas.find(productSchema => productSchema.id === productId);
 
  if (!isObject(variants)) {
    throw new Error('Variants must be an object.');
  }
  
  if (objectLen(variants) > objectLen(productSchema.variants)) {
    throw new Error('Variants options must be lower or equal product variants.');
  }

  for (const key in variants) {
    if (!productSchema.variants.hasOwnProperty(key)) {
      throw new Error(`Key: ${key}, is not valid.`);
    }
    else if (!productSchema.variants[key].includes(variants[key])) {
      throw new Error(`Option: ${variants[key]} is not valid.`);
    }
  }
}

/**
 * Test if a value is an object
 * 
 * @param {*} val 
 */
function isObject(val) {
  return typeof val === 'object';
}

/**
 * Return an object's length
 * 
 * @param {*} obj 
 */
function objectLen(obj) {
  return Object.keys(obj).length;
}

/**
 * Verify and calculate additionals and return the sum
 * 
 * @param {orderItemSchema} 
 * @param {Array} productsSchemas 
 */
function calculateAditionals({ additonals, productId }, productsSchemas) {
  const productSchema = productsSchemas.find(productSchema => productSchema.id === productId);

  // *WHY ARRAY IF IT IS OBJECT
  if (additonals.length > productSchema.additonals.length) {
    throw new Error('Variants options must be lower or equal product variants.');
  }
}

/**
 *  Look for document by ObjectId, return immediately if it is found in cache, 
 *  else query the main db, save to cache and then return to client
 *         
 *  @param {RedisClient} redis
 *  @param {Mongoose.Schema} model
 *  @param {ObjectId} _id 
 *  @param {function} callback
 */
function findByIdCached(redis, model, _id, callback) {
  redis.get(_id.toString(), (error, reply) => {
    if (error) {
      return callback(error, null);
    }
    else if (reply) {
      // Document is already cached
      try {
        return callback(null, JSON.parse(reply));
      } catch (error) {
        return callback(error, null);
      }
    }
    else {
      /*
        Document is not cached yet
        - then query the main db
      */
      model.findById({ _id: _id }).then(doc => {
        /*
          Document found in db, save to cache
          and return to the client
        */
        try {
          redis.set(_id.toString(), JSON.stringify(doc), () => {
            return callback(null, doc);
          });
        } catch (error) {
          return callback(error, null);
        }
      }).catch(error => {
        return callback(error, null);
      });
    }
  });
}

/**
 *  Filter and return an array of unique values
 * 
 *  @param {array} array 
 *  @return array
 */
function uniqueValues(array) {
  return array.filter((elem, index, self) => self.indexOf(elem) == index);
}

module.exports = { validateVariants, findByIdCached, calculateAditionals, uniqueValues };
