var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const reports = require("./routes/reports.route");

var app = express();



var connectToDb = require("./src/mongo/dbServer");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3001, function () {
  console.log("Express server listening on port %d in %s mode");
});

app.use(logger('dev'));
app.use(express.json({ limit: "200mb", extended: true }));
app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 500000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

reports(app);

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
