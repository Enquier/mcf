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

/**
 * The OrganizationsRequest model module.
 * @module model/OrganizationsRequest
 * @version 4.0.3
 */
export class OrganizationsRequest {
  /**
   * Constructs a new <code>OrganizationsRequest</code>.
   * @alias module:model/OrganizationsRequest
   * @class
   * @param orgs {Array.<module:model/Org>}
   */
  constructor(orgs) {
    this.orgs = orgs;
  }

  /**
   * Constructs a <code>OrganizationsRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/OrganizationsRequest} obj Optional instance to populate.
   * @return {module:model/OrganizationsRequest} The populated <code>OrganizationsRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new OrganizationsRequest();
      if (data.hasOwnProperty('orgs')) obj.orgs = ApiClient.convertToType(data.orgs, [Org]);
    }
    return obj;
  }
}

/**
 * @member {Array.<module:model/Org>} orgs
 */
OrganizationsRequest.prototype.orgs = undefined;