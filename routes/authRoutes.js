const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const router = express.Router();
const logger = require('../utils/logger');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

let refreshTokens = [];

//Register
router.post('/register', async (req, res) => {
   try{
       const { username, name, password, age } = req.body;

       const existingUser = await User.findOne({username});
       if (existingUser) {
           return res.status(400).json({message: `Username already exists`});
       }

       //Hash password
       const hashedPassword = await bcrypt.hash(password, 10);
       const newUser = new User({
           username: username,
           name: name,
           password: hashedPassword,
           age: age,
       });

       await newUser.save();
        res.status(201).json({message: 'User registered successfully', newUser});
   }
   catch(err){
       res.status(500).json({error: err.message});
   }
});

//Login
router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;

        logger.info(`Attempt login: ${username}`);

        const user = await User.findOne({username});
        if (!user) {
            logger.warn(`Login failed, User not found: ${username}`);
            return res.status(400).json({message: 'User does not exist'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid password'});
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: '15m'});
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_KEY, { expiresIn: '7d' });

        refreshTokens.push(refreshToken);

        res.status(200).json({
            message: 'Login successful',
            access_token: token,
            refresh_token: refreshToken
        });
    }
    catch(err){
        logger.error(`Error during login: ${err.message}`);
        res.status(500).json({error: err.message});
    }
});

//Token
router.post('/token', async (req, res) => {
    try{
        const {token} = req.body;

        if (!token) {
            return res.status(401).json({message: 'Token is required'});
        }

        if (!refreshTokens.includes(token)) {
            return res.status(403).json({message: 'Token is invalid'});
        }

        const decoded = jwt.verify(token, REFRESH_KEY);
        const newAccessToken = jwt.sign({id: decoded._id}, SECRET_KEY, {expiresIn: '15m' });

        res.status(200).json({refreshed_access_token: newAccessToken});
    }
    catch(err){
        res.status(403).json({error: err.message});
    }
});

module.exports = router;