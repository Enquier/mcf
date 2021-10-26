/**
 * @classification UNCLASSIFIED
 *
 * @module auth.ldap-strategy
 *
 * @copyright Copyright (C) 2021, JPL/Caltech
 *
 * @license Apache-2.0
 *
 * @owner Charles E Galey
 *
 * @description This file implements authentication using MMS.
 */

// Expose auth strategy functions
// Note: The export is being done before the import to solve the issues of
// circular references.
module.exports = {
  handleBasicAuth,
  handleTokenAuth,
  doLogin,
  validatePassword
};

// Node modules

// NPM modules
const axios = require('axios');

// MBEE modules
const Organization = M.require('models.organization');
const User = M.require('models.user');
const EventEmitter = M.require('lib.events');
const sani = M.require('lib.sanitization');
const errors = M.require('lib.errors');

// Allocate MMS configuration variable for convenience
const mmsConfig = M.config.auth.mms;

/**
 * @description This function implements handleBasicAuth() in lib/auth.js.
 * Implement authentication via LDAP using username/password and
 * configuration in config file.
 *
 * @param {object} req - Request express object.
 * @param {object} res - Response express object.
 * @param {string} username - Username to authenticate via LDAP AD.
 * @param {string} password - Password to authenticate via LDAP AD.
 *
 * @returns {Promise} Authenticated user object.
 *
 * @example
 * AuthController.handleBasicAuth(req, res, username, password)
 *   .then(user => {
 *   // do something with authenticated user
 *   })
 *   .catch(err => {
 *     console.log(err);
 *   })
 */
async function handleBasicAuth(req, res, username, password) {
  try {
    // Authenticate user
    const token = await mmsAuth(username, password);

    // Sync user with local database; return authenticated user object
    return await mmsSync(token);
  }
  catch (error) {
    throw errors.captureError(error);
  }
}

/**
 * @description This function implements handleTokenAuth() in lib/auth.js.
 * Authenticates user with passed in token.
 *
 * @param {object} req - Request express object.
 * @param {object} res - Response express object.
 * @param {string} token - User authentication token, encrypted.
 *
 * @returns {Promise} Local user object.
 *
 * @example
 * AuthController.handleTokenAuth(req, res, _token)
 *   .then(user => {
 *   // do something with authenticated user
 *   })
 *   .catch(err => {
 *     console.log(err);
 *   })
 */
async function handleTokenAuth(req, res, token) {
  // Define and initialize token

  let decryptedToken = null;
  try {
    // Decrypt the token
    decryptedToken = parseJwt(token);
    M.log.debug(decryptedToken.exp);
  }
  // If NOT decrypted, not valid and the
  // user is not authorized
  catch (decryptErr) {
    throw decryptErr;
  }

  // Ensure token not expired
  const exp = new Date(0);
  exp.setUTCSeconds(decryptedToken.exp);
  M.log.debug(`Token Expires: ${exp}`);
  M.log.debug(`Current Time: ${new Date(Date.now())}`);
  if (new Date(Date.now()) < exp) {
    let user = null;
    // Not expired, find user
    try {
      user = await User.findOne({
        _id: sani.sanitize(decryptedToken.id),
        archivedOn: null
      });
    }
    catch (findUserTokenErr) {
      throw findUserTokenErr;
    }
    // A valid session was found in the request but the user no longer exists
    if (!user) {
      // Logout user
      req.user = null;
      req.session.destroy();
      // Return error
      throw new M.NotFoundError('No user found.', 'warn');
    }
    // return User object if authentication was successful
    res.token = token;
    return user;
  }
  // If token is expired user is unauthorized
  else {
    throw new M.AuthorizationError('Token is expired or session is invalid.', 'warn');
  }
}

/**
 * @description This function implements doLogin() in lib/auth.js.
 * This function generates the session token for user login.
 * Upon successful login, generate token and set to session.
 *
 * @param {object} req - Request express object.
 * @param {object} res - Response express object.
 * @param {Function} next - Callback to express authentication.
 */
function doLogin(req, res, next) {
  M.log.info(`${req.originalUrl} Logged in ${(req.user.username || req.user._id)}`);

  req.session.token = req.user.token;

  // Callback
  next();
}

/* ------------------------( MMS Helper Functions )--------------------------*/

/**
 * @description Validates a users password with LDAP server.
 *
 * @param {object} user - LDAP user.
 * @param {string} password - Password to verify LDAP user.
 *
 * @returns {Promise} Authenticated user's information.
 */
async function mmsAuth(user, password) {
  M.log.debug(`Authenticating ${user[mmsConfig.attributes.username]} ...`);
  // Define and return promise
  let baseUrl = `${mmsConfig.url}:${mmsConfig.port}`;
  if (!mmsConfig.port) {
    baseUrl = `${mmsConfig.url}`;
  }
  M.log.debug(`Authenticating ${user} to ${baseUrl}`);
  const url = `${baseUrl}/authentication`;
  return axios({
    method: 'get',
    url: url,
    auth: {
      username: user,
      password: password
    }
  }).then(response => {
    M.log.debug(response.data.token);
    return response.data.token;
  });
}

/**
 * @description Synchronizes authenticated user's MMS information with database.
 *
 * @param {string} token -  Token received from MMS.
 *
 * @returns {Promise} Synchronized user model object.
 */
async function mmsSync(token) {
  M.log.debug('Synchronizing MMS user with local database.');
  let baseUrl = `${mmsConfig.url}:${mmsConfig.port}`;
  if (!mmsConfig.port) {
    baseUrl = `${mmsConfig.url}`;
  }
  const userData = await axios({
    method: 'get',
    url: `${baseUrl}/checkAuth`,
    headers: { Authorization: `Bearer ${token}` }
  }).catch(error => {
    M.log.error(error);
    throw new M.ServerError('Error checking token for user infomration;');
  });
  const mmsUserObj = userData.data;
  let userObject;
  let foundUser;
  try {
    // Search for user in database
    foundUser = await User.findOne({ _id: mmsUserObj[mmsConfig.attributes.username] });
  }
  catch (error) {
    throw new M.DatabaseError('Search query on user failed', 'warn');
  }

  try {
    // If the user was found, update with LDAP info
    if (foundUser) {
      // User exists, update database with LDAP information
      // const update = {
      //   fname: ldapUserObj[mmsConfig.attributes.firstName],
      //   preferredName: ldapUserObj[mmsConfig.attributes.preferredName],
      //   lname: ldapUserObj[mmsConfig.attributes.lastName],
      //   email: ldapUserObj[mmsConfig.attributes.email]
      // };

      // Save updated user to database
      // await User.updateOne({ _id: ldapUserObj[mmsConfig.attributes.username] }, update);

      // Find the updated user
      userObject = await User.findOne({ _id: mmsUserObj[mmsConfig.attributes.username] });
    }
    else {
      // User not found, create a new one
      // Initialize userData with LDAP information
      const initData = {
        _id: mmsUserObj[mmsConfig.attributes.username],
        // fname: ldapUserObj[mmsConfig.attributes.firstName],
        // preferredName: ldapUserObj[mmsConfig.attributes.preferredName],
        // lname: ldapUserObj[mmsConfig.attributes.lastName],
        // email: ldapUserObj[mmsConfig.attributes.email],
        provider: 'mms',
        changePassword: false
      };

      // Save ldap user
      userObject = (await User.insertMany(initData))[0];
    }
  }
  catch (error) {
    M.log.error(error.message);
    throw new M.DatabaseError('Could not save user data to database', 'warn');
  }
  // If user created, emit users-created
  EventEmitter.emit('users-created', [userObject]);

  let defaultOrg;
  try {
    // Find the default org
    defaultOrg = await Organization.findOne({ _id: M.config.server.defaultOrganizationId });
  }
  catch (error) {
    throw new M.DatabaseError('Query operation on default organization failed', 'warn');
  }

  try {
    // Add the user to the default org
    defaultOrg.permissions[userObject._id] = ['read', 'write'];

    // Save the updated default org
    await Organization.updateOne({ _id: M.config.server.defaultOrganizationId },
      { permissions: defaultOrg.permissions });
  }
  catch (saveErr) {
    M.log.error(saveErr.message);
    throw new M.DatabaseError('Could not save new user permissions to database', 'warn');
  }

  // Append the token to the new user object
  userObject.token = token;

  // Return the new user
  return userObject;
}

/**
 * @description Decrypts MMS Token information.
 *
 * @param {string} token -  Token received from MMS.
 *
 * @returns {Promise} Synchronized token data object.
 */
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const bufferBase64 = Buffer.from(base64, 'base64');
  const decodedBase64 = bufferBase64.toString('ascii');
  const jsonPayload = decodeURIComponent(decodedBase64.split('').map((c) => {
    return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
  }).join(''));

  return JSON.parse(jsonPayload);
}

/**
 * @description Validates a users password with set rules.
 *
 * @param {string} password - Password to validate.
 *
 * @returns {boolean} If password is correctly validated.
 */
function validatePassword(password) {
  // LDAP does not require local password validation, return true
  return true;
}
