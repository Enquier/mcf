/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.api-client.AuthService
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description Defines the auth service.
 */
// Other modules
import $ from 'jquery';
import { redirect } from 'react-router-dom';

// MBEE modules
import ApiClient from './ApiClient';
import uiConfig from '../../../../build/json/uiConfig.json';
import formatter from './lib/formatter';

// const navigation = useNavigate();
const tokenName = (uiConfig.apiServer && uiConfig.apiServer.tokenName) ? uiConfig.apiServer.tokenName : 'mbee-token';

class AuthService extends ApiClient {
  constructor(authContext, httpContext) {
    super(authContext, httpContext, '', 'auth');
    this.interceptor = null;
  }

  async login(form) {
    const [err, result] = await super.makeRequest(form, { method: 'POST' }, '/authentication');
    if (result) {
      const { token } = result;
      await this.save(token);
    }
    return [err, result];
  }

  async errorComposer(error) {
    return () => {
      const statusCode = error.response ? error.response.status : null;
      if (statusCode === 401) {
        window.sessionStorage.removeItem('mbee-user');
        window.localStorage.removeItem(tokenName);
        this.authContext.setAuth(null);
        if (this.interceptor) {
          this.httpContext.httpClient.interceptors.request.eject(this.interceptor);
          this.interceptor = null;
        }
      }
    };
  }

  async save(token) {
    this.authContext.setAuth(token);
    window.localStorage.setItem(tokenName, token);
    this.interceptor = this.httpContext.httpClient.interceptors.request.use((config) => {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = this.authContext.auth ? `Bearer ${this.authContext.auth}` : '';
      return config;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  logout() {
    window.sessionStorage.removeItem('mbee-user');
    window.localStorage.removeItem(tokenName);
    this.authContext.setAuth(null);
    if (this.interceptor) {
      this.httpContext.httpClient.interceptors.request.eject(this.interceptor);
      this.interceptor = null;
    }
    redirect('/login');
  }

  async checkAuth(callback) {
  // If user is already stored, use that.
    const mbeeUser = window.sessionStorage.getItem('mbee-user');
    if (mbeeUser) {
      callback(null, JSON.parse(mbeeUser));
    }

    // If not found, do httpClient call
    await $.ajax({
      method: 'GET',
      url: ApiClient.buildUrl('/checkAuth'),
      statusCode: {
        401: () => {
          const path = window.location.pathname;
          if (!path.startsWith('/doc') && !path.startsWith('/login')
            && !path.startsWith('/about')) {
            // Refresh when session expires
            this.logout();
          }
        },
      },
      success: (_data) => {
        const data = _data; //formatter.formatResponse({}, _data, 'user');
        if (data.username) {
          window.sessionStorage.setItem('mbee-user', JSON.stringify(data.users[0]));
        }
        callback(null, data);
      },
      error: (err) => {
        callback(err, null);
      },
    });
  }
}

export default AuthService;
