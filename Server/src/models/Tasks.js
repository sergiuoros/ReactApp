/**
 * Created by SergiuOros on 11/12/16.
 */
var Sequelize = require( 'sequelize');
var sequelizeService = require( "../services/SequelizeService");
const sequelize = sequelizeService.getSequelize();

const Tasks = sequelize.define('Tasks', {
  id : {
    type : Sequelize.INTEGER,
    field : 'id',
    primaryKey : true,
    autoIncrement : true
  },
  assignee : {
    type : Sequelize.STRING,
    field : 'assignee'
  },
  name : {
    type : Sequelize.STRING,
    field : 'name'
  },
  description : {
    type : Sequelize.STRING,
    field : 'description'
  },
  deadline : {
    type : Sequelize.DATE,
    field : 'deadline'
  }
}, {
  freezeTableName : true,
  timestamps : false
});
sequelize.sync();

module.exports =   Tasks;