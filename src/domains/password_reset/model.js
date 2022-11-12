const mongoose = require('mongoose');

const schema = mongoose.Schema;

const passwordResetSchema = schema({
    userId: {
        type: String,
    },
    resetString: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    }
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);

