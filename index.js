const express = require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const mainRouter = require('./routes/main');
const authRouter = require('./routes/authRoutes');

require('dotenv').config();
const port = process.env.PORT || 3000;

//Middleware
app.use(express.json());

//Security
app.use(helmet());

//Compress
app.use(compression());

//Cache static file in 1 day
app.use(express.static(path.join(__dirname, 'public'), {maxAge: '1d'}));

//App routes
app.use(mainRouter);
app.use('/api', userRoutes);
app.use('/api/auth', authRouter);

//Mongo DB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI
).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

//Handle error
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({message: err.message});
});

//Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});