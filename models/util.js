/**
 *  @desc  Look for document by ObjectId,
 *         return immediately if it is found in cache,
 *         else query the main db, save to cache 
 *         and then return to client.
 *         
 *  @param {RedisClient} redis
 *  @param {Mongoose.Schema} model
 *  @param {ObjectId} _id 
 *  @param {function} callback
 */

function findByIdCached(redis, model, _id, callback) {
  redis.get(_id, (error, reply) => {
    if (error) {
      callback(error, null);
    }
    else if (reply) {
      // Document is already cached
      try {
        callback(JSON.parse(reply));
      } catch (error) {
        callback(error, null);
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
          redis.set(_id, JSON.stringify(doc), () => {
            callback(null, doc);
          });
        } catch (error) {
          callback(error, null);
        }
      }).catch(error => {
        callback(error, null);
      });
    }
  });
}

module.exports = findByIdCached;
