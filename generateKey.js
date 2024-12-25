const crypto = require('crypto');

const generateKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    console.log('generated key:', secretKey);
    return secretKey;
};

generateKey();