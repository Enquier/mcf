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
import { Ref } from './Ref';

/**
 * The RefsRequest model module.
 * @module model/RefsRequest
 * @version 4.0.3
 */
export class RefsRequest {
  /**
   * Constructs a new <code>RefsRequest</code>.
   * @alias module:model/RefsRequest
   * @class
   * @param refs {Array.<module:model/Ref>}
   */
  constructor(refs) {
    this.refs = refs;
  }

  /**
   * Constructs a <code>RefsRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RefsRequest} obj Optional instance to populate.
   * @return {module:model/RefsRequest} The populated <code>RefsRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new RefsRequest();
      if (data.hasOwnProperty('refs')) obj.refs = ApiClient.convertToType(data.refs, [Ref]);
    }
    return obj;
  }
}

/**
 * @member {Array.<module:model/Ref>} refs
 */
RefsRequest.prototype.refs = undefined;
