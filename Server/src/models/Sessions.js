/**
 * Created by SergiuOros on 11/12/16.
 */
var Sequelize = require( 'sequelize');
var  sequelizeService = require( "../services/SequelizeService");

const sequelize = sequelizeService.getSequelize();

const Sessions = sequelize.define('Sessions', {
  id        : {
    type         : Sequelize.INTEGER,
    field        : 'id',
    primaryKey   : true,
    autoIncrement: true
  },
  userid    : {
    type : Sequelize.INTEGER,
    field: 'userid'
  },
  token     : {
    type : Sequelize.STRING,
    field: 'token'
  },
  expiration: {
    type : Sequelize.DATE,
    field: 'expiration'
  }
}, {
  freezeTableName: true
});

sequelize.sync();

module.exports =   Sessions;