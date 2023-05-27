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

/**
 * The Permission model module.
 * @module model/Permission
 * @version 4.0.3
 */
export class Permission {
  /**
   * Constructs a new <code>Permission</code>.
   * @alias module:model/Permission
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>Permission</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Permission} obj Optional instance to populate.
   * @return {module:model/Permission} The populated <code>Permission</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Permission();
      if (data.hasOwnProperty('name')) obj.name = ApiClient.convertToType(data.name, 'String');
      if (data.hasOwnProperty('role')) obj.role = ApiClient.convertToType(data.role, 'String');
    }
    return obj;
  }
}

/**
 * @member {String} name
 */
Permission.prototype.name = undefined;

/**
 * @member {String} role
 */
Permission.prototype.role = undefined;
