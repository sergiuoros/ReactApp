/**
 * Created by SergiuOros on 11/12/16.
 */
var Tasks = require('../models/Tasks');
var Users = require('../models/Users');
var { validateToken } = require("../services/Authentication");

module.exports = class TasksEndpoint {

  constructor(app) {
    app.get('/tasks/', (req, res) => {
      let response = {
        success: false,
        error: "Unauthorized"
      };
      validateToken(res, req.headers['x-auth-token']).then(userId => {
        Tasks.findAll().then(tasks => {
          response = {
            success: true,
            data: tasks
          };
          res.status(200).send(response);
        }, err => {
          res.status(401).send(response);
        });
      }).catch(() => {
        res.status(401).send(response);
      });
    });

    app.get('/tasks/:id', function (req, res) {
      Tasks.findById(req.params.id).then(task => {
        Users.findById(task.assigneeId).then(user => {
          data.assignee = user.username;
          let response = {
            success: true,
            data: task
          };
          res.status(200).send(response);
        });
      }).catch(() => {
        let response = {
          success: true,
          data: []
        };
        res.status(401).send(response);
      });
    });

    app.post('/tasks/', function (req, res) {
      let response = {
        success: false,
        error: "Unauthorized"
      };
      validateToken(res, req.headers['x-auth-token']).then(userid => {
        Users.find({
          where: {
            username: req.body.assignee
          }
        }).then(user => {
          Tasks.create({
            assignee: req.body.assignee,
            name: req.body.name,
            description: req.body.description,
            deadline: req.body.deadline
          }).then(task => {
            response = {
              success: true,
              data: task
            };
            res.status(200).send(response);
          }, err => {
            console.log(err);
            res.status(401).send(response);
          });
        });
      }).catch(() => {
        res.status(401).send(response);
      });
    });

    app.post('/tasks/getByProperty', function (req, res) {
      let where = {},
          property = req.body.property;

      where[property] = req.body.value;

      Tasks.findAll({
        where: where
      }).then(tasks => {
        if (tasks) {
          res.status(200).send({
            success: true,
            data: tasks
          });
        } else {
          res.status(200).send({
            success: false
          });
        }
      }).catch(() => {
        res.status(401).send({
          success: false
        });
      });
    });

    app.put('/tasks/:id', function (req, res) {
      let response = {
        success: false,
        error: "Unauthorized"
      };
      validateToken(res, req.headers['x-auth-token']).then(userid => {
        Tasks.findById(req.params.id).then(task => {
          task.updateAttributes({
            assigneeId: assigneeId,
            name: req.body.name,
            description: req.body.description,
            deadline: req.body.deadline
          });
          response = {
            success: true
          };
          res.status(200).send(response);
        }, err => {
          res.status(401).send(response);
        });
      }).catch(() => {});
    });

    app.delete('/tasks/:id', function (req, res) {
      Tasks.destroy({
        where: {
          id: req.params.id
        }
      }).then(rowDeleted => {
        // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
          let response = {
            success: true
          };
          res.status(200).send(response);
        }
      }, err => {
        let response = {
          success: false
        };
        res.status(401).send(response);
      });
    });
  }
};