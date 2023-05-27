/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.api-client.ProjectService
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description Defines the project service.
 */

// MBEE modules
import ApiClient from './ApiClient';

class ProjectService extends ApiClient {
  constructor(authContext, httpContext) {
    super(authContext, httpContext, '/projects', 'project');
  }

  postProcess(results, options) {
    return new Promise((resolve, reject) => {
      const dataP = [];
      for (let i = 0; i < results.length; i += 1) {
        const result = results[i];
        const ids = { projectId: result.id };
        dataP.push(super.getPermission(ids, result));
        if (options.params.populate.indexOf('projects') > -1) {
          dataP.push(super.getProjects(result));
        }
      }
      Promise.all(dataP).then(() => resolve([null, results]), (reason) => reject(reason));
    });
  }

  get(orgId, options) {
    options.params.orgId = orgId;
    return super.get(options);
  }

  post(orgId, data, options) {
    data.orgId = orgId;
    return super.post(data, options);
  }

  patch(orgId, data, options) {
    return this.post(orgId, data, options);
  }

  put(orgid, data, options) {
    const url = `${this.url}/${orgid}/projects`;
    return super.put(data, options, url);
  }

  delete(orgid, data, options) {
    const url = `${this.url}/${orgid}/projects`;
    return super.delete(data, options, url);
  }
}

export default ProjectService;
