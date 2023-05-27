/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.api-client.ApiClient
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description Defines the api client class.
 */

import _ from 'lodash';
import uiConfig from '../../../../build/json/uiConfig.json';
import formatter from './lib/formatter';

export default class ApiClient {
  constructor(authContext, httpContext, url, type) {
    this.httpContext = httpContext;
    this.authContext = authContext;
    this.url = url;
    this.config = uiConfig;
    this.type = type;
    this.makeRequest = this.makeRequest.bind(this);
    if (uiConfig.apiServer.type) {
      this.format = uiConfig.apiServer.type;
    } else {
      this.format = 'mcf';
    }
  }

  // eslint-disable-next-line no-unused-vars
  async postProcess(results, options) {
    return Promise.resolve(results);
  }

  async get(options = {}, url = this.url) {
    options.method = 'GET';
    return new Promise((resolve, reject) => {
      this.makeRequest(null, options, url)
        .then((d) => {
          if (d[0] !== null) reject(d[0]);
          const results = d[1];
          this.postProcess(results, options)
            .then(() => resolve(results), (reason) => reject(reason));
        }, (reason) => reject(reason));
    });
  }

  async post(data, options = {}, url = this.url) {
    options.method = 'POST';
    const fData = formatter.formatRequest(data, this.type);
    return new Promise((resolve, reject) => {
      this.makeRequest(fData, options, url)
        .then((d) => {
          if (d[0] !== null) reject(d[0]);
          const results = d[1];
          this.postProcess(results, options)
            .then(() => resolve(results), (reason) => reject(reason));
        }, (reason) => reject(reason));
    });
  }

  async patch(data, options = {}, url = this.url) {
    const opts = options;
    opts.method = 'PATCH';
    const fData = formatter.formatRequest(data, this.type);
    return this.makeRequest(fData, opts, url);
  }

  async put(data, options = {}, url = this.url) {
    const opts = options;
    opts.method = 'PUT';
    const fData = formatter.formatRequest(data, this.type);
    return this.makeRequest(fData, opts, url);
  }

  async delete(data, options = {}, url = this.url) {
    const opts = options;
    opts.method = 'DELETE';
    const fData = formatter.formatRequest(data, this.type);
    return this.makeRequest(fData, opts, url);
  }

  async search(query, options = {}, url = this.url) {
    const opts = options;
    opts.method = 'POST';
    // options.q = query;
    return this.makeRequest(query, opts, url);
  }

  async getPermission(ids, data) {
    const lookupPermission = (lookupIds, isPublic) => {
      const lookup = lookupIds;
      lookup.type = _.upperCase(this.type);
      const permissions = [`${lookup.type}_READ`,
        `${lookup.type}_EDIT${lookup.type === 'BRANCH' ? '_CONTENT' : ''}`,
        `${lookup.type}_UPDATE_PERMISSIONS`,
      ];
      const request = {
        lookups: [],
      };

      for (let i = 0; i < permissions.length; i += 1) {
        const newLookup = JSON.parse(JSON.stringify(lookup));
        newLookup.privilege = permissions[i];
        request.lookups.push(newLookup);
      }

      return this.makeRequest(request, { method: 'PUT' }, '/permissions', 'permission', { isPublic });
    };
    return new Promise((resolve, reject) => {
      lookupPermission(ids, data.custom.mms.public).then(
        (allPerm) => {
          const [permErr, perms] = allPerm;
          if (permErr) reject(permErr);
          data.permissions = perms;
          resolve();
        },
        (reason) => reject(reason),
      );
    });
  }

  async getProjects(data) {
    data.projects = [];
    return new Promise((resolve, reject) => {
      this.makeRequest(null, { method: 'GET', params: { orgId: data.id } }, '/projects', 'project').then(
        (projects) => {
          const [projErr, proj] = projects;
          if (projErr) reject(projErr);
          data.projects = proj;
        },
        (reason) => reject(reason),

      );
    });
  }

  async makeRequest(data, options, baseUrl, source = this.type, formatOpts = {}) {
    // Initialize options for the request
    const fetchOpts = {
      url: ApiClient.buildUrl(baseUrl, options),
      headers: { 'Content-Type': 'application/json' },
    };
    const requestOpts = Object.assign(fetchOpts, options);
    if (data) requestOpts.data = JSON.stringify(data);
    if (requestOpts.body && !requestOpts.data) {
      requestOpts.data = requestOpts.body;
      delete requestOpts.body;
    }
    if (requestOpts.ids && !requestOpts.data) {
      requestOpts.data = {};
      requestOpts.data[`${source}`] = requestOpts.ids.split(',');
      delete requestOpts.ids;
    }

    // Make the request
    const response = await this.httpContext.httpClient(requestOpts);

    // Check for errors in response status code
    const error = await ApiClient.checkError(response);

    // Return either the error or the data
    if (error) {
      return [error, null];
    }
    const resp = await response;
    const fopts = formatOpts;
    fopts.req = options;
    const result = formatter.formatResponse(resp.data, source, fopts);
    return [null, result];
  }

  static buildUrl(base) {
    let url = '';
    if (uiConfig.apiServer) {
      url = uiConfig.apiServer.hostUrl;
      if (uiConfig.apiServer.basePath !== '') {
        if (uiConfig.apiServer.basePath.startsWith('/')) {
          url = `${url}${uiConfig.apiServer.basePath}`;
        } else {
          url = `${url}/${uiConfig.apiServer.basePath}`;
        }
      }
    } else {
      url = '/api';
    }
    return `${url}${base}`;
    // if (options) {
    //   const opts = '';
    //
    //   // Set minified to true by default
    //   // if (options.minified !== false) opts += 'minified=true&';
    //
    //   Object.keys(options).forEach((opt) => {
    //     // Ignore the following options
    //     if (opt === 'orgid'
    //       || opt === 'projectid'
    //       || opt === 'branchid'
    //       || opt === 'elementid'
    //       || opt === 'artifactid'
    //       || opt === 'webhookid'
    //       || opt === 'ids'
    //       || opt === 'whoami') return;
    //     // Add the option to the query
    //     opts += `${opt}=${options[opt]}&`;
    //   });
    //
    //   if (opts.length === 0) {
    //     // No options; return original url
    //     return url;
    //   }
    //   else {
    //     // Get rid of the trailing '&'
    //     opts = opts.slice(0, -1);
    //     // Return the url with options
    //     return `${url}?${opts}`;
    //   }
    // }
    // else {
    //   return url;
    // }
  }

  static checkError(response) {
    if (response.status >= 200 && response.status < 300) {
      return null;
    }
    // if (response.status === 401) {
    //   // break the auth state
    //   removeAuthToken();
    // }
    return response.text();
  }
}
