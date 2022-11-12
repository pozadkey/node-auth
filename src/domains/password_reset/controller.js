const compareHashedData = require("../../utils/compare_hashed_data");
const { sendVerificationEmail } = require('../email_verification/controller')
const PasswordReset = require('./model');
const sendEmail = require('../../utils/send_email');
const User = require('../user/model');
const hashData = require('../../utils/hash_data');
const UserVerification = require('../user/model');

// Unique string
const  { v4: uuidv4 } = require('uuid');    
const { findOne } = require("../user/model");

//Send reset password email
const resetPasswordEmail = async ({ _id, email }) => {
    try {
        // Url  to website
        const websiteUrl = 'http://localhost:5000/';

        const resetString = uuidv4() + _id;

        // Clear  all existing reset records.
        PasswordReset.deleteMany({ user:_id });

         // Send password reset email
         const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Reset Password',
            html: `<p> We received a request to reset the password on your account. Please click <a href=${websiteUrl + 'reset-password/' + _id + '/' + resetString}><b>here</b></a> to complete the reset.</p><p>This link expires in <b>60 minutes.</b></p>`
        }

        // Hash reset string
        const hashedResetString = await hashData(resetString);

        // Set values in password reset collection
        const newPasswordReset = new PasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        //Save password reset records
        await newPasswordReset.save();

        //Send password reset  email
        await sendEmail(mailOptions);

        return({
            userId:_id,
            email
        })
    } catch (error) {
        throw error
    }
}

// Reset password 
const resetPassword = async(data) => {
    try {
        const { email } = data;

        const userData = await User.findOne({ email });

        // Check if the email exists
        if (!userData) throw Error(`No account is associated with this email.`);

        // Check if  the email is verified
       if(!userData.verified) {
            await UserVerification.deleteMany(userData._id);
            await sendVerificationEmail(userData);
            throw Error(`Email hasn't been verified. A verification email has been sent to ${email} `);
        } else {
            resetPasswordEmail(userData);
        }       
    } catch (error) {
        throw error;
    }
}

// Validate password reset link
const validatePassResetLink = async(data) => {
    try {
        const { userId, resetString } = data;
        const userData = await PasswordReset.findOne({ userId });
        
        // Check if userId is valid
        const userIdData = await userData.userId;

        if (!userIdData) throw Error (`Invalid link.`);

        //  Check if resetString is valid and compare to  with hashedResetStringData
        const hashedResetString = await userData.resetString;

        const resetStringdata = await compareHashedData(resetString, hashedResetString);

        if (!resetStringdata) throw Error(`Invalid link`);
    
        // Password request found
        const { expiresAt } = userData;

        // Check if password reser link has expired
        const isLinkExpired = expiresAt < Date.now();
        
        if (isLinkExpired){
            await PasswordReset.deleteOne({ userId });
            throw Error(`Password reset link has expired.`);
        } else {
            return ({
                userId,
                resetString
            })
        }
    }  catch (error) {
        throw error;
    }
}

// Change password after reset
const changePassword = async (data) => {
   try {
        const { userId,  resetString, newPassword, confirmNewPassword } = data;

        // Check if resetString exists
        const userData = await PasswordReset.findOne({ userId })

        // Check if password resert record exist
        if (!userData) throw Error(`Password reset record not found`);

            // Password request found
        const { expiresAt } = userData;
        const hashedResetString = userData.resetString;

        // Check if password reser link has expired
        islinkExpired = expiresAt < Date.now();
        if (islinkExpired) {
            await PasswordReset.deleteOne({ userId });
            throw Error(`Password reset link has expired.`);
        } else {
            // Check if reset string is same as in database
            const isResetStringMatched = await compareHashedData(resetString, hashedResetString)
            if (!isResetStringMatched) throw Error(`Invalid password reset details`);

            // Reset strings match
            // Compare newPassword  and confirmNewPassword
            const comparePassword = (newPassword == confirmNewPassword);
            if (!comparePassword) throw Error(`Passwords don\'t match.`)

            // Hash new password
            const hashedNewPassword = await hashData(newPassword);

            // Update user password
            await User.updateOne( { _id: userId }, { password: hashedNewPassword });

            // Delete password record after user update
            await PasswordReset.deleteOne({ userId })

            return ({
                userId,
                resetString,
                newPassword,
                confirmNewPassword
            });
        }
   } catch (error) {
        throw error;
   }
}

module.exports = { resetPasswordEmail, resetPassword, validatePassResetLink, changePassword};
