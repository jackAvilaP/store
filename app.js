const express = require('express');
const cors = require('cors');

//limitar el limite de peticiones max 
const rateLimit = require('express-rate-limit');

// Controllers
const { globalErrorHandler } = require('./controllers/errors.controller');


// Routers
const { usersRouter } = require('./routes/users.routes');
const { productsRouter } = require('./routes/products.routes');
const { cartsRouter } = require('./routes/carts.routes');



// Init express app
const app = express();

//enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());


//limt
const limiter = rateLimit({
    max: 10000,
    windowMs: 1 * 60 * 60 * 1000,//1 hr
    message: 'to many requests from this IP'
});

// Endpoints
// http://localhost:4700/api/v1/users
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartsRouter);

// Global error handler
app.use('*', globalErrorHandler);
module.exports = { app }