var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

global.config = require('./config')

var auth = require('./routes/Auth');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', config.allow_origin_host)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    if(req.method === 'OPTIONS') return res.end()
    next()
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
