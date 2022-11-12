const bcrypt = require('bcrypt');

// Function to hash data
const  hashData =  async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    } catch (error) {
        throw error;
    }
}

module.exports = hashData;