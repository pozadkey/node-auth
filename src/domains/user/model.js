const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String
    },
    verified: {
        type: Boolean 
    },
    createdAt: {
        type: Date,
    }
});

module.exports = mongoose.model('User', userSchema);