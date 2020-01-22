'use strict';

const superagent = require('superagent');
const users = require('../../models/users-model');

/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

const TOKEN_SERVER = process.env.TOKEN_SERVER;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;
const REDIRECT = process.env.REDIRECT;

module.exports = async function authorize(req, res, next) {

  try {
    let code = req.query.code;
    console.log('(1) CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER', user);

    next();
  } catch (e) { next(`ERROR: ${e.message}`); }

};

/**
 * Sends code in exchange for github token
 * @param {*} code 
 */
async function exchangeCodeForToken(code) {


  let tokenResponse = await superagent.post(TOKEN_SERVER).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;

  return access_token;

}

/**
 * Retrieves user information for github
 * @param {*} token 
 */
async function getRemoteUserInfo(token) {

  let userResponse =
    await superagent.get(API_SERVER)
      .set('user-agent', 'express-app')
      .set('Authorization', `token ${token}`);

  let user = userResponse.body;

  return user;

}

/**
 * Posts user record into local database
 * @param {*} remoteUser 
 */
async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: 'oauthpassword',
  };

  let user = await users.post(userRecord);
  let token = users.generateToken(user);

  return [user, token];

}
