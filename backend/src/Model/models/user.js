'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,  
    avatar: DataTypes.STRING,
    phonenumber:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
