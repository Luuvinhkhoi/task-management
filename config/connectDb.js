const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize('task', 'postgres', process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});
const connection = async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = connection