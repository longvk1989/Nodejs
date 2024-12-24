const express = require('express');
const router = express.Router();
const User = require('../models/User');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddlewares');

//Create a new user
router.post('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try{
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});

//Read all users
router.get('/users', authMiddleware, async (req, res) => {
    try{
        const { page = 1, limit = 10 } = req.query;

        const users = await User.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            users,
        });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

//Read user by id
router.get('/users/:id', authMiddleware, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({error: 'No user with this id'});
        }
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

//Update user
router.put('/users/:id', authMiddleware, async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        if (!updatedUser){
            return res.status(404).json({error: 'No user with this id'});
        }

        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
});

router.delete('/users/:id', authMiddleware, async (req, res) => {
   try{
       const deletedUser = await User.findByIdAndDelete(req.params.id);
       if (!deletedUser) {
           return res.status(404).json({message: 'User not found'});
       }
       res.status(200).json({message: 'User deleted successfully'});
   }
   catch(err){
       res.status(500).json({error: err.message});
   }
});

module.exports = router;