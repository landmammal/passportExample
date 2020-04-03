const express = require("express");
const db = require("./models");
const passport = require("./config/passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const isAuthenticated = require("./config/middleware/isAuthenticated");

const app = express();

// middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/profile", isAuthenticated, function(req, res) {
  res.render("profile", { user: req.user });
});

app.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup"
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  })
);

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

db.sequelize.sync().then(function() {
  app.listen(3000, function() {
    console.log("we are lit!");
  });
});
