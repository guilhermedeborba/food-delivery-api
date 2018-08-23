const jwt = require('jsonwebtoken');

function auth(req, res, next){

  // Get token from header
  const token = getTokenFromHeader(req);

  if(token){
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedData) => {
      if(!error){

        // Set payload to the decoded token
        req.payload = decodedData;
        next();
      }else{
        res.status(403).json({error: 'The token is invalid.'});
      }
    });
  }
  else{
    res.status(401).json({error: 'No Authorization Token was found.'});
  }
}

function getTokenFromHeader(req){

  // Test if authorization header exists
  if(req.headers.authorization){

    // Split it in space
    const parts = req.headers.authorization.split(' ');

    if(parts.length === 2){
      const scheme = parts[0];
      const credentials = parts[1];

      // Test scheme Authorization: Bearer <credentials>
      if (scheme === 'Bearer'){
        return credentials;
      }
    }
  }

  return null;
}

module.exports = auth;