'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    title: DataTypes.STRING,
    endedAt: {
      type: DataTypes.DATE,
      field: 'endedAt' // Ánh xạ cột updatedAt thành endedAt
    }

  }, {
    sequelize,
    modelName: 'Project',
    timestamps: true,
    createdAt: true, 
    updatedAt: false 
  });
  return Project;
};