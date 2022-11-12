const { check } = require('express-validator');

const  registerValidator = [
    check('firstName', 'Please enter a valid firstname.')
    .not()
    .isEmpty(),
    check('lastName', 'Please enter a valid lastname.')
    .not()
    .isEmpty(),
    check('username', 'Please enter a valid username.')
    .not()
    .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check("password", 'Password must not be less than 6 characters.').isLength({
        min: 6
    })
];

const loginValidator = [
    check('email', 'Please enter a valid email').isEmail(),
    check("password", 'Password cannot be less than 6 characters.').isLength({
        min: 6
    })
];

const passwordResetValidator = [
    check('email', 'Please enter a valid email').isEmail(),
];

const newPasswordValidator = [
    check('newPassword', 'Please enter a valid password.')
    .not()
    .isEmpty(),
    check('confirmNewPassword', 'Please enter a valid password.')
    .not()
    .isEmpty(),
    check("password", 'Password cannot be less than 6 characters.').isLength({
        min: 6
    }),
    check("confirmNewPassword", 'Password cannot be less than 6 characters.').isLength({
        min: 6
    })
];

module.exports = { registerValidator, loginValidator, passwordResetValidator, newPasswordValidator };