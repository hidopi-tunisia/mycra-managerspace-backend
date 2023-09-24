var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var config = require(process.env.NODE_ENV === 'test' ? './config/test.connect' : './config/connect');
var firebaseConfig = require('./config/firebaseConfig');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const clientRoute = require("./routes/client");
const consultantRoute = require("./routes/consultant");
const projetRoute = require("./routes/projet");
const craRoute = require("./routes/cra");
const managerRoute = require("./routes/manager");
const offreRoute = require("./routes/offre");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
//app.use(logger(':remote-addr :method :url :status :response-time ms - :res[content-length] '));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/client", clientRoute);
app.use("/consultant", consultantRoute);
app.use("/projet", projetRoute);
app.use("/cra", craRoute);
app.use("/manager", managerRoute);
app.use("/offre", offreRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
