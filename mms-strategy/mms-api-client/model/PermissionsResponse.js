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
import { PermissionResponse } from './PermissionResponse';

/**
 * The PermissionsResponse model module.
 * @module model/PermissionsResponse
 * @version 4.0.3
 */
export class PermissionsResponse {
  /**
   * Constructs a new <code>PermissionsResponse</code>.
   * @alias module:model/PermissionsResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>PermissionsResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PermissionsResponse} obj Optional instance to populate.
   * @return {module:model/PermissionsResponse} The populated <code>PermissionsResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new PermissionsResponse();
      if (data.hasOwnProperty('inherit')) obj.inherit = ApiClient.convertToType(data.inherit, 'Boolean');
      if (data.hasOwnProperty('users')) obj.users = PermissionResponse.constructFromObject(data.users);
      if (data.hasOwnProperty('groups')) obj.groups = PermissionResponse.constructFromObject(data.groups);
      if (data.hasOwnProperty('public')) obj._public = ApiClient.convertToType(data.public, 'Boolean');
    }
    return obj;
  }
}

/**
 * @member {Boolean} inherit
 */
PermissionsResponse.prototype.inherit = undefined;

/**
 * @member {module:model/PermissionResponse} users
 */
PermissionsResponse.prototype.users = undefined;

/**
 * @member {module:model/PermissionResponse} groups
 */
PermissionsResponse.prototype.groups = undefined;

/**
 * @member {Boolean} _public
 */
PermissionsResponse.prototype._public = undefined;
