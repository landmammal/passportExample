let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      db.User.findOne({ where: { email: email } }).then(function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "That email is already taken." });
        }

        db.User.create({
          email: email,
          password: password
        }).then(function(newUser) {
          if (newUser) {
            return done(null, newUser);
          }
        });
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      db.User.findOne({ where: { email: email } }).then(function(user) {
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializing user: ", user.id);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
