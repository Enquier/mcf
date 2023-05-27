/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.api-client.OrgService
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description Defines the organization service.
 */

// MBEE modules
import ApiClient from './ApiClient';

class OrgService extends ApiClient {
  constructor(authContext, httpContext) {
    super(authContext, httpContext, '/orgs', 'org');
  }

  postProcess(results, options) {
    return new Promise((resolve, reject) => {
      const dataP = [];
      for (let i = 0; i < results.length; i += 1) {
        const result = results[i];
        const ids = { orgId: result.id };
        dataP.push(super.getPermission(ids, result));
        if (options.params.populate.indexOf('projects') > -1) {
          dataP.push(super.getProjects(result));
        }
      }
      Promise.all(dataP).then(() => resolve([null, results]), (reason) => reject(reason));
    });
  }
}

export default OrgService;
