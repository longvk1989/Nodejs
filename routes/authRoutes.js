const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const router = express.Router();

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

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

        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({message: 'User does not exist'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid password'});
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: '1h'});
        res.status(200).json({ message: 'Login successful', token});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;