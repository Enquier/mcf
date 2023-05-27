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
import { User } from './User';

/**
 * The UsersResponse model module.
 * @module model/UsersResponse
 * @version 4.0.3
 */
export class UsersResponse {
  /**
   * Constructs a new <code>UsersResponse</code>.
   * @alias module:model/UsersResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>UsersResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UsersResponse} obj Optional instance to populate.
   * @return {module:model/UsersResponse} The populated <code>UsersResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new UsersResponse();
      if (data.hasOwnProperty('users')) obj.users = ApiClient.convertToType(data.users, [User]);
    }
    return obj;
  }
}

/**
 * @member {Array.<module:model/User>} users
 */
UsersResponse.prototype.users = undefined;
