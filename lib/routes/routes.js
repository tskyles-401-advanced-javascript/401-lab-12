'use strict';
// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../docs/config/swagger.json');

const express = require('express');
const router = express.Router();
const Users = require('../models/users-model');
const users = new Users;
const basicAuth = require('../middleware/auth/auth-middleware');

// home route
router.get('/', (req, res, next) => {
  res.json('Welcome!');
});
// swagger routes
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
// api routes
router.post('/signup', (req, res, next) => {  
  users.save(req.body)
    .then(rec => {
      const token = users.generateToken(rec);
      res.status(200).send(token);
    })
    .catch(err => res.status(403).send('trouble creating user'));
});

router.post('/signin', basicAuth, (req, res) => {
  res.status(200).send(req.token);
});

router.get('/users', (req, res)=> {
  users.get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err =>{
      res.status(403).send('Could not get user list');
    });
});


module.exports = router;