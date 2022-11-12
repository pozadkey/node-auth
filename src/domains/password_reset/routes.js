const express = require('express');
const { resetPassword, validatePassResetLink, changePassword } = require('./controller');
const router = express.Router();
const { validationResult } = require("express-validator");
const { passwordResetValidator, newPasswordValidator } = require('../../middlewares/validators')

router.post('/',  async (req, res) => {
    try {
        const { email } = req.body;
        email.trim();   

        const errors = validationResult(req);

        if (!errors.isEmpty) {
            return res.status(401).json({
                errors: errors.array()
            });
        } else {
            await resetPassword ({
                email
            })
    
            res.status(202).json({
                message: `A password reset link has been sent to ${ email }.`
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
         });
    }
});


router.get('/:userId/:resetString', async (req, res) => {
    try {
        let { userId, resetString } = req.params;

        /* This only validates if the Password Reset Link is active or not .
         For more realistic projects, you can redirect to your form page on the client-side 
        to accept user data and make a POST to validate them. */

        await validatePassResetLink({
            userId, 
            resetString
        })

        res.status(200).json({
            message: `Password reset link validated.`
        });

    } catch(error){
        res.status(400).json({
            message: error.message
        });
    }
});


// Change password
router.post('/new-password', newPasswordValidator,  async (req, res) => {
    try {
    const { userId,  resetString, newPassword, confirmNewPassword } = req.body;
    userId.trim();
    resetString.trim();
    newPassword.trim();
    confirmNewPassword.trim();

    const errors = validationResult(req);

    if(!errors.isEmpty){
        return res.status(401).json({
            errors: errors.array()
        });
    } else {
        await changePassword ({
            userId,
            resetString,
            newPassword,
            confirmNewPassword
        })

        res.status(202).json({
            message: `Password reset successful.`
        });
    }
    } catch (error) {
        res.status(400).json({
            message: error.message
         });
    }
})

module.exports = router;