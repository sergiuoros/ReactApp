/**
 * Created by SergiuOros on 11/12/16.
 */
var Users = require('../models/Users');
var bcrypt = require('bcrypt');
var Sessions = require('../models/Sessions');
var { validateToken } = require("../services/Authentication");

module.exports = class UsersEndPoint {
  constructor(app) {
    app.get('/users', function (req, res) {
      let response = {
        success: false,
        data: []
      };

      Users.findAll().then(users => {
        response = {
          success: true,
          data: users
        };
        res.status(200).send(response);
      }).catch(() => {
        res.status(401).send(response);
      });
    });

    app.get('/users/:userId', function (req, res) {
      let response = {
        success: false
      };

      Users.findById(req.params.userId).then(user => {
        if (user) {
          //otherwise, we could acces password = require( client
          delete user.password;
          response = {
            success: true,
            data: user
          };
          res.status(200).send(response);
        } else {
          res.status(401).send(response);
        }
      }).catch(() => {
        res.status(401).send(response);
      });
    });

    app.post('/users/login', function (req, res) {
      let response = {
        success: false
      };

      Users.find({
        where: {
          username: req.body.username
        }
      }).then(user => {
        if (user) {
          bcrypt.compare(req.body.password, user.dataValues.password, (err, result) => {
            if (result === true) {
              let expiration = Date.now() + 60000000,
                  token;
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.username, salt, (err, hash) => {
                  token = hash.concat('_', user.password);
                  Sessions.create({
                    userid: user.dataValues.id,
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
            } else {
              //I use this because I have to announce the user that username and password are not correct
              //If I'd send 401, the client would automatically fire logout
              res.status(400).send(response);
            }
          });
        } else {
          res.status(401).send(response);
        }
      }).catch(err => {
        res.status(401).send(response);
      });
    });

    app.post('/users/getByProperty', function (req, res) {
      let where = {},
          property = req.body.property,
          response = {
        success: false
      };

      where[property] = req.body.value;

      Users.findAll({
        where: where
      }).then(user => {
        if (user.length === 1) {
          user.password = null;
          response = {
            success: true,
            data: user
          };
          res.status(200).send(response);
        } else {
          //I use this because I have to announce the user that username already exist
          //If I'd send 401, the client would automatically fire logout
          res.status(200).send(response);
        }
      }).catch(() => {
        res.status(401).send(response);
      });
    });

    app.post('/users', function (req, res) {
      let response = {
        success: false
      };

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          Users.findAll({
            where: {
              username: req.body.username
            }
          }).then(users => {
            if (users.length > 0) {
              res.status(401).send(response);
            } else {
              Users.create({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                phone: req.body.phone,
                online: 'false'
              }).then(user => {
                delete user.password;
                response = {
                  success: true,
                  data: user
                };
                res.status(200).send(response);
              }).catch(() => {
                res.status(401).send(response);
              });
            }
          });
        });
      });
    });

    app.put('/users/:id', function (req, res) {
      let response = {
        success: false
      };

      Users.findById(req.params.id).then(user => {
        user.update({
          online: req.body.online
        }).then(() => {
          response = {
            success: true
          };
          res.status(200).send(response);
        }).catch(() => {
          res.status(401).send(response);
        });
      }).catch(() => {
        res.status(401).send(response);
      });
    });

    app.delete('/users/:deleteUserId', function (req, res) {
      let response = {
        success: false
      };

      Users.findById(req.params.deleteUserId).then(user => {
        user.destroy();
        response = {
          success: true
        };
        res.status(200).send(response);
      }).catch(() => {
        res.status(200).send(response);
      });
    });
  }
};