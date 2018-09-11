/**
 *  Look for document by ObjectId, return immediately if it is found in cache, 
 *  else query the main db, save to cache and then return to client.
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

module.exports = { findByIdCached, uniqueValues };
