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
import { Mount } from './Mount';
import { Rejection } from './Rejection';

/**
 * The MountsResponse model module.
 * @module model/MountsResponse
 * @version 4.0.3
 */
export class MountsResponse {
  /**
   * Constructs a new <code>MountsResponse</code>.
   * @alias module:model/MountsResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>MountsResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MountsResponse} obj Optional instance to populate.
   * @return {module:model/MountsResponse} The populated <code>MountsResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new MountsResponse();
      if (data.hasOwnProperty('messages')) obj.messages = ApiClient.convertToType(data.messages, ['String']);
      if (data.hasOwnProperty('rejected')) obj.rejected = ApiClient.convertToType(data.rejected, [Rejection]);
      if (data.hasOwnProperty('projects')) obj.projects = ApiClient.convertToType(data.projects, [Mount]);
    }
    return obj;
  }
}

/**
 * @member {Array.<String>} messages
 */
MountsResponse.prototype.messages = undefined;

/**
 * @member {Array.<module:model/Rejection>} rejected
 */
MountsResponse.prototype.rejected = undefined;

/**
 * @member {Array.<module:model/Mount>} projects
 */
MountsResponse.prototype.projects = undefined;