'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectMember.belongsTo(models.Project, {
          foreignKey: 'projectId',
          as: 'project' // nếu cần truy ngược
      });
    }
  }
  ProjectMember.init({
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đánh dấu là một phần của composite primary key
      references: {
        model: 'Projects',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đánh dấu là một phần của composite primary key
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'ProjectMember',
  });
  return ProjectMember;
};