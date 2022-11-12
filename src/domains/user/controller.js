const User = require('./model');
const hashData = require('../.././utils/hash_data');
const compareHashedData = require('../../utils/compare_hashed_data')
const generateToken = require('../../utils/generate_token');

// Jwt secret
const secret = process.env.SECRET;

// Register new user
const registerNewUser =  async (data) => {
    try {
        const { firstName, lastName, username, email, password, confirmPassword } = data;
        
        const existingUser = await User.findOne({
            email
        });

        // Check if user already exists
        if (existingUser)  throw Error(`User with provided email already exists.`);
        
        const  existingUsername = await User.findOne({
            username
         })

         // Check if username is available
         if (existingUsername) throw Error(`Username already exists.`);

     // Check if password and confrim-password match
     if(password !== confirmPassword) {
        throw Error(`Passwords don\'t match.`);
     } else {
        // Hash password
        const hashedPassword = await hashData(password);
        
        // Create new user object
        const  newUser = new User({
           name: `${firstName} ${lastName}`,
           username,
           email,
           password: hashedPassword,
           verified: false
        });

        // Save user
        const createdUser = await newUser.save();
        return createdUser;
     }
    } catch (error) {
       throw error;
    }
}


// Login user
const loginUser = async (data) => {
    try {
    const { email, password  } = data; 
    
    let existingUser = await User.findOne({ email });

    // Find existing email
    if (!existingUser) throw Error(`Email does not exist.`);

    const hashedPassword = existingUser.password;

    const isPasswordMatched = await compareHashedData(password, hashedPassword);
    
    if (!isPasswordMatched) throw Error('Password Incorrect.');

    // Check if exisring user is verified
    if (!existingUser.verified) throw Error(`Your email hasn\'t been verified yet. Check your inbox.`);
    
    const payload = {
        user: {
            id: existingUser.id
        }
     }

     // Sign payload to get token
     const signPayloadData = await generateToken(payload, secret);
     if (!signPayloadData) throw Error(`Invalid token`);

     console.log(`Login token: ${signPayloadData}`);

     const loggedInUser = ({
        email,
        password,
     })

     return loggedInUser;
        
    } catch (error) {
        throw error
    }
}

module.exports = { registerNewUser, loginUser };