var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var salesRouter = require('./routes/sales');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var ordersRouter = require('./routes/orders');
var reportsRouter = require('./routes/reports');

var app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/sales', salesRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reports', reportsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

module.exports = app;
