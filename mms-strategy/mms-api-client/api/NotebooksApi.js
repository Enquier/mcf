/*
 * MMS Reference Implementation API
 * Documentation for MMS API
 *
 * OpenAPI spec version: 4.0.3
 * Contact: mms@openmbee.org
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.29
 *
 * Do not edit the class manually.
 *
 */
import { ApiClient } from '../ApiClient';
import { NotebooksRequest } from '../model/NotebooksRequest';
import { NotebooksResponse } from '../model/NotebooksResponse';

/**
* Notebooks service.
* @module api/NotebooksApi
* @version 4.0.3
*/
export class NotebooksApi {
  /**
    * Constructs a new NotebooksApi.
    * @alias module:api/NotebooksApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
  }

  /**
     * Callback function to receive the result of the createOrUpdateNotebooks operation.
     * @callback moduleapi/NotebooksApi~createOrUpdateNotebooksCallback
     * @param {String} error Error message, if any.
     * @param {module:model/NotebooksResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {module:model/NotebooksRequest} body
     * @param {String} projectId
     * @param {String} refId
     * @param {Object} opts Optional parameters
     * @param {String} opts.overwrite
     * @param {module:api/NotebooksApi~createOrUpdateNotebooksCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  createOrUpdateNotebooks(body, projectId, refId, opts, callback) {
    opts = opts || {};
    const postBody = body;
    // verify the required parameter 'body' is set
    if (body === undefined || body === null) {
      throw new Error("Missing the required parameter 'body' when calling createOrUpdateNotebooks");
    }
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error("Missing the required parameter 'projectId' when calling createOrUpdateNotebooks");
    }
    // verify the required parameter 'refId' is set
    if (refId === undefined || refId === null) {
      throw new Error("Missing the required parameter 'refId' when calling createOrUpdateNotebooks");
    }

    const pathParams = {
      projectId, refId,
    };
    const queryParams = {
      overwrite: opts.overwrite,
    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];
    const returnType = NotebooksResponse;

    return this.apiClient.callApi(
      '/projects/{projectId}/refs/{refId}/notebooks',
      'POST',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      callback,
    );
  }
  /**
     * Callback function to receive the result of the getAllNotebooks operation.
     * @callback moduleapi/NotebooksApi~getAllNotebooksCallback
     * @param {String} error Error message, if any.
     * @param {module:model/NotebooksResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {String} projectId
     * @param {String} refId
     * @param {Object} opts Optional parameters
     * @param {String} opts.commitId
     * @param {module:api/NotebooksApi~getAllNotebooksCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  getAllNotebooks(projectId, refId, opts, callback) {
    opts = opts || {};
    const postBody = null;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error("Missing the required parameter 'projectId' when calling getAllNotebooks");
    }
    // verify the required parameter 'refId' is set
    if (refId === undefined || refId === null) {
      throw new Error("Missing the required parameter 'refId' when calling getAllNotebooks");
    }

    const pathParams = {
      projectId, refId,
    };
    const queryParams = {
      commitId: opts.commitId,
    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = NotebooksResponse;

    return this.apiClient.callApi(
      '/projects/{projectId}/refs/{refId}/notebooks',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      callback,
    );
  }
  /**
     * Callback function to receive the result of the getNotebook operation.
     * @callback moduleapi/NotebooksApi~getNotebookCallback
     * @param {String} error Error message, if any.
     * @param {module:model/NotebooksResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {String} projectId
     * @param {String} refId
     * @param {String} notebookId
     * @param {Object} opts Optional parameters
     * @param {String} opts.commitId
     * @param {module:api/NotebooksApi~getNotebookCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  getNotebook(projectId, refId, notebookId, opts, callback) {
    opts = opts || {};
    const postBody = null;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error("Missing the required parameter 'projectId' when calling getNotebook");
    }
    // verify the required parameter 'refId' is set
    if (refId === undefined || refId === null) {
      throw new Error("Missing the required parameter 'refId' when calling getNotebook");
    }
    // verify the required parameter 'notebookId' is set
    if (notebookId === undefined || notebookId === null) {
      throw new Error("Missing the required parameter 'notebookId' when calling getNotebook");
    }

    const pathParams = {
      projectId, refId, notebookId,
    };
    const queryParams = {
      commitId: opts.commitId,
    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = NotebooksResponse;

    return this.apiClient.callApi(
      '/projects/{projectId}/refs/{refId}/notebooks/{notebookId}',
      'GET',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      callback,
    );
  }
  /**
     * Callback function to receive the result of the getNotebooks operation.
     * @callback moduleapi/NotebooksApi~getNotebooksCallback
     * @param {String} error Error message, if any.
     * @param {module:model/NotebooksResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {module:model/NotebooksRequest} body
     * @param {String} projectId
     * @param {String} refId
     * @param {Object} opts Optional parameters
     * @param {String} opts.commitId
     * @param {module:api/NotebooksApi~getNotebooksCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  getNotebooks(body, projectId, refId, opts, callback) {
    opts = opts || {};
    const postBody = body;
    // verify the required parameter 'body' is set
    if (body === undefined || body === null) {
      throw new Error("Missing the required parameter 'body' when calling getNotebooks");
    }
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error("Missing the required parameter 'projectId' when calling getNotebooks");
    }
    // verify the required parameter 'refId' is set
    if (refId === undefined || refId === null) {
      throw new Error("Missing the required parameter 'refId' when calling getNotebooks");
    }

    const pathParams = {
      projectId, refId,
    };
    const queryParams = {
      commitId: opts.commitId,
    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];
    const returnType = NotebooksResponse;

    return this.apiClient.callApi(
      '/projects/{projectId}/refs/{refId}/notebooks',
      'PUT',
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      callback,
    );
  }
}