'use strict';

const { CgPassword } = require('react-icons/cg');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     * 
    */
    await queryInterface.bulkInsert('Users', 
      [
        {
          email:'johndoe1@gmail.com',
          password:'pass123',
          username:'johndoe1'
        },
        {
          email:'johndoe2@gmail.com',
          password:'pass123',
          username:'johndoe2'
        },
        {
          email:'johndoe3@gmail.com',
          password:'pass123',
          username:'johndoe3'
        }
      ]
    , {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
