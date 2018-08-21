const expressJwt = require('express-jwt');

const auth = expressJwt({
  secret: process.env.JWT_SECRET,
  requestProperty: 'payload',
});

function errorHandler(err, req, res, next){
  if(err.name === 'UnauthorizedError'){
    res.status(401).json(err.inner);
  }else{
    next();
  }
}

module.exports = [
  auth, 
  errorHandler
];