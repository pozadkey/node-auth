const express = require('express');
const router = express.Router();
const { verifyEmail } = require('./controller');

// Verify email
router.get('/:userId/:uniqueString', async (req, res) => {
    try {
        let { userId, uniqueString } = req.params;
        
        await verifyEmail({
            userId,
            uniqueString
        })

        res.status(200).json({
            message: `Email verified successfully.`
        });

    } catch(error){
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;