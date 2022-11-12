const express = require('express');
const router = express.Router();

// User routes
const userRoutes  =  require('../domains/user');
const emailVerificationRoutes = require('../domains/email_verification');
const passwordResetRoutes = require('../domains/password_reset');

// routes
router.use('/user', userRoutes);
router.use('/verify-email', emailVerificationRoutes);
router.use('/reset-password', passwordResetRoutes);

// HomePage
router.get('/', (req, res)=>{
    try {
        res.status(200).json({
            message: `This is the homepage`
        })
    } catch (error){
        res.status(500).json({
            message: `Error connecting to page.`
        })
    }
});

// Handle unknown routes.
router.get('*', (req, res)=>{
    res.status(404).json({
        message: `This page does not exist.`
    })
});

module.exports = router;