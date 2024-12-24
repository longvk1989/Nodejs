const crypto = require('crypto');

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    console.log('secretKey', secretKey);
    return secretKey;
};

generateSecretKey();