const compareHashedData = require('../../utils/compare_hashed_data');
const hashData =  require('../../utils/hash_data');
const sendEmail = require('../../utils/send_email');
const UserVerification = require('./model');
const User = require('../user/model');

// Unique string
const  { v4: uuidv4 } = require('uuid');                            

// Send verifcation email
const sendVerificationEmail =  async ({ _id, email}) => {
    try {
        // Url  to website
        const websiteUrl = 'http://localhost:5000/';
        
        const uniqueString = uuidv4() + _id; 
        
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Please verify your email',
            html: `<p> Thank your for becoming  a member. Please click <a href=${websiteUrl + 'verify-email/' + _id + '/' + uniqueString}><b>here</b></a> to verify your account. <p>This link expires in 6 hours</p></p>`
        }
        
        const hashedUniqueString = await hashData(uniqueString);
        
        const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
    });

    //Save verification records
    await newVerification.save();

    // Send verification email
    await sendEmail(mailOptions);

    return ({
        userId: _id,
        email
            });
    } catch (error) {
        throw error;    
    }
}


// Verify Email
const verifyEmail = async(data) => {
    try {
        const { userId, uniqueString } = data;
        
        const userData = await UserVerification.findOne({ userId });

        // Check if user verification data exisit
        if (!userData) throw Error (`Invalid link`);

        // Check if link has expired
        const {expiresAt} = userData;
        const isLinkExpired = expiresAt < Date.now();
        if (isLinkExpired) {
            await UserVerification.deleteOne({ userId });
            await User.deleteOne({ _id: userId });
            throw Error (`Link has expired. Please register again.`);
        } else {
            // Valid user verification record
            const hashedUniqueString = userData.uniqueString;
            isUniqueStringMatched = compareHashedData(uniqueString, hashedUniqueString);
            if (!isUniqueStringMatched) throw Error (`Invalid link. Pleae check your inbox.`);
            
            // Strings match and valid  then update user 
             await User.updateOne({ _id: userId }, { verified: true });

             // Delete user verification record
             await UserVerification.deleteOne({ userId });

             return ({
                userId,
                uniqueString
             })
        }
    } catch (error) {
        throw error
    }
}

module.exports = { sendVerificationEmail, verifyEmail };