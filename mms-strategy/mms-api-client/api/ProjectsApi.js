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
import { ProjectsRequest } from '../model/ProjectsRequest';
import { ProjectsResponse } from '../model/ProjectsResponse';
import { SchemasResponse } from '../model/SchemasResponse';

/**
* Projects service.
* @module api/ProjectsApi
* @version 4.0.3
*/
export class ProjectsApi {
  /**
    * Constructs a new ProjectsApi.
    * @alias module:api/ProjectsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
  }

  /**
     * Callback function to receive the result of the createOrUpdateProjects operation.
     * @callback moduleapi/ProjectsApi~createOrUpdateProjectsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ProjectsResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {module:model/ProjectsRequest} body
     * @param {module:api/ProjectsApi~createOrUpdateProjectsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  createOrUpdateProjects(body, callback) {
    const postBody = body;
    // verify the required parameter 'body' is set
    if (body === undefined || body === null) {
      throw new Error("Missing the required parameter 'body' when calling createOrUpdateProjects");
    }

    const pathParams = {

    };
    const queryParams = {

    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = ['application/json'];
    const accepts = ['application/json'];
    const returnType = ProjectsResponse;

    return this.apiClient.callApi(
      '/projects',
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
     * Callback function to receive the result of the deleteProject operation.
     * @callback moduleapi/ProjectsApi~deleteProjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ProjectsResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {String} projectId
     * @param {Object} opts Optional parameters
     * @param {Boolean} opts.hard  (default to <.>)
     * @param {module:api/ProjectsApi~deleteProjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  deleteProject(projectId, opts, callback) {
    opts = opts || {};
    const postBody = null;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error("Missing the required parameter 'projectId' when calling deleteProject");
    }

    const pathParams = {
      projectId,
    };
    const queryParams = {
      hard: opts.hard,
    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = ProjectsResponse;

    return this.apiClient.callApi(
      '/projects/{projectId}',
      'DELETE',
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
     * Callback function to receive the result of the getAllProjects operation.
     * @callback moduleapi/ProjectsApi~getAllProjectsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ProjectsResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.orgId
     * @param {module:api/ProjectsApi~getAllProjectsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  getAllProjects(opts, callback) {
    opts = opts || {};
    const postBody = null;

    const pathParams = {

    };
    const queryParams = {
      orgId: opts.orgId,
    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = ProjectsResponse;

    return this.apiClient.callApi(
      '/projects',
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
     * Callback function to receive the result of the getProject operation.
     * @callback moduleapi/ProjectsApi~getProjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ProjectsResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {String} projectId
     * @param {module:api/ProjectsApi~getProjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  getProject(projectId, callback) {
    const postBody = null;
    // verify the required parameter 'projectId' is set
    if (projectId === undefined || projectId === null) {
      throw new Error("Missing the required parameter 'projectId' when calling getProject");
    }

    const pathParams = {
      projectId,
    };
    const queryParams = {

    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = ['basicAuth', 'bearerToken'];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = ProjectsResponse;

    return this.apiClient.callApi(
      '/projects/{projectId}',
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
     * Callback function to receive the result of the getProjectSchemaOptions operation.
     * @callback moduleapi/ProjectsApi~getProjectSchemaOptionsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SchemasResponse{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

  /**
     * @param {module:api/ProjectsApi~getProjectSchemaOptionsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
  getProjectSchemaOptions(callback) {
    const postBody = null;

    const pathParams = {

    };
    const queryParams = {

    };
    const headerParams = {

    };
    const formParams = {

    };

    const authNames = [];
    const contentTypes = [];
    const accepts = ['application/json'];
    const returnType = SchemasResponse;

    return this.apiClient.callApi(
      '/schemas',
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
}
