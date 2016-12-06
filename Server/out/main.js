/**
 * Created by SergiuOros on 11/12/16.
 */
var express = require('express');
var bodyParser = require('body-parser');
var listen = require('./main.listen');

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var UsersEndpoint = require('./endpoints/UsersEndpoint');
var TasksEndpoint = require('./endpoints/TasksEndpoint');
//var SessionsEndpoint = require( './endpoints/SessionsEndpoint';

new UsersEndpoint(app);
new TasksEndpoint(app);
//(new SessionsEndpoint(app));

listen(app);