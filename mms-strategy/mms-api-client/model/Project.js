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
 * The Project model module.
 * @module model/Project
 * @version 4.0.3
 */
export class Project {
  /**
   * Constructs a new <code>Project</code>.
   * @alias module:model/Project
   * @class
   * @extends
   */
  constructor() {
  }

  /**
   * Constructs a <code>Project</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Project} obj Optional instance to populate.
   * @return {module:model/Project} The populated <code>Project</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Project();
      ApiClient.constructFromObject(data, obj, '');
    }
    return obj;
  }
}
