'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Task-members', {
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model:{
            tableName:'Tasks',
          },
          key:'id',
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model:{
            tableName:'Users',
          },  
          key:'id',
        }
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
    await queryInterface.dropTable('Task-members');
  }
};