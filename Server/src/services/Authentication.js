/**
 * Created by SergiuOros on 11/12/16.
 */
var Sessions = require('../models/Sessions');
var Q = require( 'q');

const validateToken = function (res, token) {
  var deferred = Q.defer();
  
  Sessions.find({
    where: {
      token: token
    }
  }).then((session) => {
    if (!session.dataValues.userid) {
      deferred.reject("Unauthorized");
    } else {
      deferred.resolve(session.dataValues.userid)
    }
  }).catch(() => {
    deferred.reject("Unauthorized");
  });
  return deferred.promise;
};

module.exports = {validateToken};