const jwt = require('jsonwebtoken');

// Function to verify token
const verifyToken = async (token, secretKey) => {
    try {
        const verifiedToken = jwt.verify(token, secretKey);
        return verifiedToken;
    } catch (error) {
        throw error.message;
    }
}

module.exports = verifyToken;