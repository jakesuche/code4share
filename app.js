var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
 var expressValidator = require('express-validator')
var bodyParser = require('body-parser')

var mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const passport1 = require('./passport')

// passport1()

require('./passport')
var config = require('./config')


var indexRouter = require('./routes/index');
var auth = require('./routes/auth')
var taskRoute = require('./routes/rtask')

mongoose.connect(config.dbconnection, {useNewUrlParser:true,useUnifiedTopology:true})
// mongoose.connect(DB,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connection.on('error', console.error.bind(console, 'Database connection Error')); /// handling the error
mongoose.connection.once('open', function(){
    console.log('connected to Database');
})
global.User = require('./models/user')
var usersRouter = require('./routes/users');
global.Task = require('./models/task')


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  secret:config.sessionKey,
  resave:false,
  saveUninitialized:true,
  // cookie:{secure:true}
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){
  if(req.isAuthenticated()){
    res.locals.user = req.user;
  }
  next()
})

app.use('/', indexRouter);
app.use('/', auth)
app.use('/users', usersRouter);
app.use('/', taskRoute)

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
