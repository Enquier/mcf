/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.api-client.ElementService
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description Defines the element service.
 */

// MBEE modules
import ApiClient from './ApiClient';

class ElementService extends ApiClient {
  constructor(authContext, httpContext) {
    super(authContext, httpContext, '/projects', 'element');
  }

  get(orgID, projID, refID, options) {
    const url = `${this.url}/${projID}/refs/${refID}/elements`;
    return super.get(options, url);
  }

  post(orgID, projID, refID, data, options) {
    const url = `${this.url}/${projID}/refs/${refID}/elements`;
    return super.post(data, options, url);
  }

  patch(orgID, projID, refID, data, options) {
    const url = `${this.url}/${projID}/refs/${refID}/elements`;
    return super.patch(data, options, url);
  }

  put(orgID, projID, refID, data, options) {
    const url = `${this.url}/${projID}/refs/${refID}/elements`;
    return super.put(data, options, url);
  }

  delete(orgID, projID, refID, data, options) {
    const url = `${this.url}/${projID}/refs/${refID}/elements`;
    return super.delete(data, options, url);
  }

  search(orgID, projID, refID, query, options) {
    const url = `${this.url}/${projID}/refs/${refID}/search`;
    return super.search(query, options, url);
  }
}

export default ElementService;
