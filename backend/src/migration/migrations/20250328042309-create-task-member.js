'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'TaskMembers',
      {
        task_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true, // Đánh dấu là một phần của composite primary key
          references: {
            model: 'Tasks',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true, // Đánh dấu là một phần của composite primary key
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskMembers'); // Sửa lại tên bảng đúng chính tả
  },
};