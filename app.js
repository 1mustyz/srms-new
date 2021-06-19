var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport')
const expressSession = require('express-session')
const redis = require('redis')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const redisStore = require('connect-redis')(expressSession)
const redisClient = redis.createClient()
const sessionMiddleware = expressSession({
  secret: '[credentials.secret]',
  store: new redisStore({ host: 'localhost', port: 6379, client: redisClient }),
  saveUninitialized: false,
  resave: true
})
const Staff = require('./models/Staff')
const Student = require('./models/Student')
const studentRouter = require('./routes/studentRoute')
const staffRouter = require('./routes/staffRoute')
const adminRouter = require('./routes/AdminRoute')
const teacherRouter = require('./routes/teacherRoute')


// //connect to db
mongoose.connect('mongodb://localhost/srms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.Promise = global.Promise

// test DB connection
mongoose.connection
  .once('open', () => {
    console.log('mongodb started')
    // connect the server if DB is UP
    // http.listen(PORT, () => {
    //   console.log(`server started `)
    // })
  })
  .on('error', (error) => {
    console.log('error occured:', error)
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
app.use(passport.initialize())
app.use(passport.session())
app.use(sessionMiddleware)


passport.use('staff', Staff.createStrategy())
passport.use('student', Student.createStrategy())

passport.serializeUser(Staff.serializeUser())
passport.serializeUser(Student.serializeUser())
passport.deserializeUser(Staff.deserializeUser())
passport.deserializeUser(Student.deserializeUser())

app.use('/staff', staffRouter)
app.use('/student', studentRouter)
app.use('/admin', adminRouter)
app.use('/teacher', teacherRouter)


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
