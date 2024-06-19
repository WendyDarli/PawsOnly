const initializePassport = require('./config/passport');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const createError = require('http-errors');
const session = require('express-session');
const flash = require('express-flash');
const db = require('./connectionDB');
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const path = require('path');
require('dotenv').config();


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Ensuring MongoDB connection is established before creating session store
const mongoClientPromise = new Promise((resolve) => {
  mongoose.connection.on("connected", () => {
    const client = mongoose.connection.getClient();
    resolve(client);
  });
});

// session store setup
const sessionStore = MongoStore.create({
  client: mongoClientPromise,
  dbName: process.env.DB_NAME,
  collection: process.env.DB_COLLECTION
});

// Session middleware setup
app.use(session({
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
