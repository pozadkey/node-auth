const bcrypt = require('bcrypt');

const compareHashedData = async(unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        throw error;
    }
}

module.exports = compareHashedData;