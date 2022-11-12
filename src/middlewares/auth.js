const verifyToken = require('../utils/verify_token')

require('dotenv').config();

const secret = process.env.SECRET;

// Authenticate user session
const auth = async (req, res, next) => {
  try {
    // Get bearer Header  token from authorization
    const bearerHeader = req.headers['authorization'];

    const bearer =  await bearerHeader.split(" ");
    const bearerToken = await bearer[1];

     // Verify if the request has an authorization header value
    const isBearerHeaderEmpty = (typeof bearerHeader  == 'undefined');

    if(isBearerHeaderEmpty) throw  res.status(403).json({
      message: 'Bearer Header is empty.'
    })

   //Verify token
    const verifyTokenData = await verifyToken(bearerToken, secret)
    if (!verifyTokenData) throw  res.status(403).json({
      message: 'Invalid token.'
    })

    next();
      
  } catch (error){
    res.status(401).json({
      message: error
    })
  }
}

module.exports = auth;