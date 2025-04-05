'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstname: { // ✅ Thêm cột
        type: Sequelize.STRING
      },
      lastname: { // ✅ Thêm cột
        type: Sequelize.STRING
      },
      avatar: { // ✅ Thêm cột
        type: Sequelize.STRING
      },
      phonenumber:{
        type:Sequelize.STRING
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

    // ❌ Xóa cột `username`
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};
