/**
 * Created by SergiuOros on 11/12/16.
 */
var Sequelize = require( 'sequelize');
var sequelizeService = require( "../services/SequelizeService");
const sequelize = sequelizeService.getSequelize();

const Users = sequelize.define('Users', {
  id : {
    type : Sequelize.INTEGER,
    field : 'id',
    primaryKey : true,
    autoIncrement : true
  },
  username : {
    type : Sequelize.STRING,
    field : 'username'
  },
  password : {
    type : Sequelize.STRING,
    field : 'password'
  },
  email : {
    type : Sequelize.STRING,
    field : 'email'
  },
  phone : {
    type : Sequelize.INTEGER,
    field : 'phone'
  },
  online : {
    type : Sequelize.BOOLEAN,
    field : 'online',
    defaultValue : false
  }
}, {
  freezeTableName : true,
  timestamps : false
});
sequelize.sync();

module.exports =   Users;