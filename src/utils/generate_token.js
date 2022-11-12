const jwt = require('jsonwebtoken');

// Function to verify token
const generateToken = async (payload, secretKey) => {
    try {
        const signPayload = jwt.sign(payload, secretKey, {expiresIn: '30m'});
        return signPayload;
    } catch (error) {
        throw error.message;
    }
}

module.exports = generateToken;