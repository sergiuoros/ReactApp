/**
 * Created by SergiuOros on 11/12/16.
 */
var Sequelize = require( 'sequelize');

const sequelize = new Sequelize('TasksManager', 'root', '', {
  host : '127.0.0.1',
  dialect : 'mysql',
  port : 3307
});

module.exports.getSequelize = function() {
  return sequelize;
};