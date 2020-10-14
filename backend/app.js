var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));

app.use('/users', usersRouter);

// since this is a react app, all the views are handled by the frontend
// so we have our route handlers for the api endpoints our server should provide
// but if the route doesnt match any of the data endpoints, we just send the html file back and
// react will handle the routing for the views from there 
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html")); 
})

module.exports = app;
