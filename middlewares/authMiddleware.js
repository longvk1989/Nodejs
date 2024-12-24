const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {

    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({message: 'Authorization header is missing'});
    }

    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'No token provided'});
    }

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message: 'No token provided'});
    }
};

module.exports = authMiddleware;