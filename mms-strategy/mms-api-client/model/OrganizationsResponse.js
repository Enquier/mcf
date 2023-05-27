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
import { Org } from './Org';
import { Rejection } from './Rejection';

/**
 * The OrganizationsResponse model module.
 * @module model/OrganizationsResponse
 * @version 4.0.3
 */
export class OrganizationsResponse {
  /**
   * Constructs a new <code>OrganizationsResponse</code>.
   * @alias module:model/OrganizationsResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>OrganizationsResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/OrganizationsResponse} obj Optional instance to populate.
   * @return {module:model/OrganizationsResponse} The populated <code>OrganizationsResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new OrganizationsResponse();
      if (data.hasOwnProperty('messages')) obj.messages = ApiClient.convertToType(data.messages, ['String']);
      if (data.hasOwnProperty('rejected')) obj.rejected = ApiClient.convertToType(data.rejected, [Rejection]);
      if (data.hasOwnProperty('orgs')) obj.orgs = ApiClient.convertToType(data.orgs, [Org]);
    }
    return obj;
  }
}

/**
 * @member {Array.<String>} messages
 */
OrganizationsResponse.prototype.messages = undefined;

/**
 * @member {Array.<module:model/Rejection>} rejected
 */
OrganizationsResponse.prototype.rejected = undefined;

/**
 * @member {Array.<module:model/Org>} orgs
 */
OrganizationsResponse.prototype.orgs = undefined;
