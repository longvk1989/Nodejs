const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('hello world');
});

router.post('/api/data', (req, res) => {
    const data = req.body;
    res.json({message: 'Data Received', data});
});

module.exports = router;