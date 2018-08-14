const jwt = require('express-jwt');

const auth = jwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'payload',
    getToken: getTokenFromHeader
});


function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
      return req.headers.authorization.split(' ')[1];
  }
  return null;
}

module.exports = auth;