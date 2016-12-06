/**
 * Created by SergiuOros on 11/12/16.
 */
var Sessions = require('../models/Sessions');
var Users = require('../models/Users');
var bcrypt = require('bcrypt');
var { validateToken } = require("../services/Authentication");

module.exports = class SessionsEndpoint {
  constructor(app) {
    app.get('/sessions/', function (req, res) {
      Sessions.find({
        where: {
          token: req.headers['x-auth-token']
        }
      }).then(session => {
        if (session !== null && Date.parse(session.expiration) > Date.now()) {
          let response = {
            success: true,
            data: session
          };
          res.status(200).send(response);
        } else {
          let response = {
            success: false
          };
          session.destroy();
          res.status(200).send(response);
        }
      }, err => {
        let response = {
          success: false,
          data: null
        };
        res.status(401).send(response);
      });
    });

    app.get('/sessions/:id', function (req, res) {
      Sessions.findById(req.params.id).then(session => {
        let response = {
          success: true,
          data: session
        };
        res.status(200).send(response);
      }).catch(err => {
        let response = {
          success: true,
          data: []
        };
        res.status(401).send(response);
      });
    });

    app.post('/sessions/', function (req, res) {
      Users.findById(req.body.userid).then(user => {
        let expiration = Date.now() + 6000000,
            token;
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.username, salt, (err, hash) => {
            token = hash.concat('_', user.password);
            Sessions.create({
              userid: req.body.userid,
              token: token,
              expiration: expiration
            }).then(() => {
              let response = {
                success: true,
                token: token
              };
              res.status(200).send(response);
            }, err => {
              let response = {
                success: false
              };
              res.status(401).send(response);
            });
          });
        });
      }).catch(() => {
        let response = {
          success: false
        };
        res.status(401).send(response);
      });
    });

    app.post('/sessions/getByProperty', function (req, res) {
      let where = {},
          property = req.body.property;

      where[property] = req.body.value;

      let result = {
        success: false
      };
      Sessions.findAll({
        where: where
      }).then(session => {
        if (session.length === 1) {
          validateToken(res, req.headers['x-auth-token']).then(() => {
            result.success = true;
            result.data = session;
            res.status(200).send(result);
          }).catch(() => {
            res.status(401).send(result);
          });
        } else {
          res.status(401).send(result);
        }
      }).catch(() => {
        res.status(401).send(result);
      });
    });

    app.put('/sessions/:id', function (req, res) {
      Sessions.findById(req.params.id).then(session => {
        session.updateAttributes({});
        let response = {
          success: true
        };
        res.status(200).send(response);
      }, err => {
        let response = {
          success: false
        };
        res.status(401).send(response);
      });
    });

    app.delete('/sessions/', function (req, res) {
      Sessions.destroy({
        where: {
          token: req.headers['x-auth-token']
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