/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.api-client.UserService
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description Defines the user service.
 */

// MBEE modules
import ApiClient from './ApiClient';

class UserService extends ApiClient {
  constructor(authContext, httpContext) {
    super(authContext, httpContext, '', 'user');
  }

  async whoami(options = {}) {
    const baseUrl = '/checkAuth';

    // Store the result of the request
    const [err, data] = await super.get(options, baseUrl, { skip: true });

    // Set the mbee user session storage item
    if (!err && data.username) {
      options.user = data.username;
      const [err2, me] = await super.get(options, '/users')
      window.sessionStorage.setItem('mbee-user', JSON.stringify(me[0]));
      return [err2, me];
    } else { 
      window.sessionStorage.removeItem('mbee-user')
      return [err, {}];
    }

    
  }

  async search(query, options = {}) {
    const baseUrl = '/users/search';
    return super.search(query, options, baseUrl);
  }

  async password(data, username, options = {}) {
    const baseUrl = `/users/${username}/password`;
    options.method = 'PATCH';

    // Store the result of the request
    const [err, result] = await super.makeRequest(data, options, baseUrl);

    // Destroy the session if the user changed their own password
    if (result) {
      const sessionUser = JSON.parse(window.sessionStorage.getItem('mbee-user'));
      if (sessionUser.username === username) {
        this.authContext.setAuth(false);
        window.sessionStorage.removeItem('mbee-user');
      }
    }

    return [err, result];
  }
}

export default UserService;
