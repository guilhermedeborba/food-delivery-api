const jwt = require('express-jwt');

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET,
    customerProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET,
    customerProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }) 
};

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
      return req.headers.authorization.split(' ')[1];
  return null;
}

module.exports = auth;