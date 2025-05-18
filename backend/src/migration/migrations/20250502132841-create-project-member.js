'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProjectMembers', {
      projectId: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName:'Projects',
            key:'id'
          },
        },
        onDelete:'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName:'Users',
            key:'id'
          },
        },
        onDelete:'CASCADE'

      },
      role: {
        type: Sequelize.ENUM('viewer', 'editor', 'admin'),
        defaultValue: 'admin',
        allowNull: false
      },
      canEditProject: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      canDeleteProject: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      canCreateTask: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      canEditTask: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      canDeleteTask: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProjectMembers');
  }
};