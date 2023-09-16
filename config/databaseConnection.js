const { Sequelize } = require('sequelize');

const sequelize =  new Sequelize('carproject', 'root', 'gloify1234', {
  dialect:  'mysql',
  host: 'localhost',
});


module.exports=sequelize;