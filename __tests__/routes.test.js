'use strict';


const {server} = require('../lib/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const jwt = require('jsonwebtoken');

describe('Route Testing', () => {

  let userTest = {
    username: 'Travis',
    password: 'password',
  };

  let tokenID;

  xit('creates new user', () => {
    return mockRequest.post('/signup')
      .send(userTest)
      .then(data => {
        let token = jwt.verify(data.text, 'password');
        tokenID = token.iat;
        expect(token.iat).toBeDefined();
      });
  });

  xit('Throw error with invalid object', () => {
    return mockRequest.post('/signup')
      .send({name: 'wrong', password: 5})
      .then(data => {
        expect(data.text).toEqual('Error');
      });
  });

  xit('/users returns all users', () => {
    return mockRequest.get('/users')
      .then(data => {
        expect(data.body.count).toEqual(1);
      });
  });

  xit('/signin authenticates user', () => {
    return mockRequest.post('/signin')
      .auth(userTest.username, userTest.password)
      .then(results => {
        let token = jwt.verify(results.text, 'password');
        expect(token.iat).toEqual(tokenID);
      });
  });
});