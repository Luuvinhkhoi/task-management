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