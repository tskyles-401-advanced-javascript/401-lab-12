'use strict';

const base64 = require('base-64');
const Users = require('../../models/users-model');

module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    next('Invalid Login');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();

  let [user,pass] = base64.decode(basic).split(':');

  Users.authenticateBasic(user,pass)
    .then(validUser => {
      req.token = Users.generateToken(validUser);
      next();
    })
    .catch(err => next('Invalid Login'));
};