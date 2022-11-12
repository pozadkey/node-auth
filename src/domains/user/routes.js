const express = require('express');
const { sendVerificationEmail } = require('../email_verification/controller');
const router = express.Router();
const { validationResult } = require("express-validator");
const { registerNewUser, loginUser } = require('./controller');
const { registerValidator, loginValidator } = require('../../middlewares/validators');
const auth  = require ('../../middlewares/auth');

// Register  new user
router.post('/register', registerValidator, async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, confirmPassword } = req.body;
        firstName.trim();
        lastName.trim();
        username.trim();
        email.trim();
        password.trim();
        confirmPassword.trim();

        const errors = validationResult(req);

        // Validate user inputs
        if(!errors.isEmpty()){
            return res.status(401).json({
                errors: errors.array()
            });
        } else {
            //Valid credentials
            const newUser =  await registerNewUser({
                firstName,
                lastName,
                username,
                email,
                password,
                confirmPassword
            });
            
            await sendVerificationEmail(newUser);

            res.status(201).json({
                message: `A verification email has been sent to ${email}. Check your inbox.`
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
});

// Login user
router.post('/login', loginValidator, async (req, res) => {
    try {
        const { email, password} = req.body;
        email.trim();
        password.trim();

        const errors = validationResult(req);

        // Validate user inputs
        if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    } else {
        await loginUser ({
            email, 
            password,
        });

        res.status(202).json({
            message: `Login successful.`,
         });
    }
 } catch(error) {
    res.status(400).json({
        message: error.message
     });
    }
});

// User dashboard route
router.get('/dashboard', auth,  (req, res)=>{
    try {
        res.status(200).json({
            message: `Welcome to your dashboard.`,
         });
    } catch (error) {
        res.status(500).json({
            message: `Error authenticating user.`,
         });
    }
})

module.exports = router;