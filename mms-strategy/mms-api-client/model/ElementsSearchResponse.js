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
import { Element } from './Element';
import { Rejection } from './Rejection';

/**
 * The ElementsSearchResponse model module.
 * @module model/ElementsSearchResponse
 * @version 4.0.3
 */
export class ElementsSearchResponse {
  /**
   * Constructs a new <code>ElementsSearchResponse</code>.
   * @alias module:model/ElementsSearchResponse
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>ElementsSearchResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ElementsSearchResponse} obj Optional instance to populate.
   * @return {module:model/ElementsSearchResponse} The populated <code>ElementsSearchResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ElementsSearchResponse();
      if (data.hasOwnProperty('messages')) obj.messages = ApiClient.convertToType(data.messages, ['String']);
      if (data.hasOwnProperty('rejected')) obj.rejected = ApiClient.convertToType(data.rejected, [Rejection]);
      if (data.hasOwnProperty('elements')) obj.elements = ApiClient.convertToType(data.elements, [Element]);
      if (data.hasOwnProperty('total')) obj.total = ApiClient.convertToType(data.total, 'Number');
      if (data.hasOwnProperty('rejectedTotal')) obj.rejectedTotal = ApiClient.convertToType(data.rejectedTotal, 'Number');
    }
    return obj;
  }
}

/**
 * @member {Array.<String>} messages
 */
ElementsSearchResponse.prototype.messages = undefined;

/**
 * @member {Array.<module:model/Rejection>} rejected
 */
ElementsSearchResponse.prototype.rejected = undefined;

/**
 * @member {Array.<module:model/Element>} elements
 */
ElementsSearchResponse.prototype.elements = undefined;

/**
 * @member {Number} total
 */
ElementsSearchResponse.prototype.total = undefined;

/**
 * @member {Number} rejectedTotal
 */
ElementsSearchResponse.prototype.rejectedTotal = undefined;
