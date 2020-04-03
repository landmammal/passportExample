"use strict";

const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return User;
};
