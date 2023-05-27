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
 * The PermissionLookup model module.
 * @module model/PermissionLookup
 * @version 4.0.3
 */
export class PermissionLookup {
  /**
   * Constructs a new <code>PermissionLookup</code>.
   * @alias module:model/PermissionLookup
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>PermissionLookup</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PermissionLookup} obj Optional instance to populate.
   * @return {module:model/PermissionLookup} The populated <code>PermissionLookup</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new PermissionLookup();
      if (data.hasOwnProperty('type')) obj.type = ApiClient.convertToType(data.type, 'String');
      if (data.hasOwnProperty('orgId')) obj.orgId = ApiClient.convertToType(data.orgId, 'String');
      if (data.hasOwnProperty('projectId')) obj.projectId = ApiClient.convertToType(data.projectId, 'String');
      if (data.hasOwnProperty('refId')) obj.refId = ApiClient.convertToType(data.refId, 'String');
      if (data.hasOwnProperty('privilege')) obj.privilege = ApiClient.convertToType(data.privilege, 'String');
      if (data.hasOwnProperty('allowAnonIfPublic')) obj.allowAnonIfPublic = ApiClient.convertToType(data.allowAnonIfPublic, 'Boolean');
      if (data.hasOwnProperty('hasPrivilege')) obj.hasPrivilege = ApiClient.convertToType(data.hasPrivilege, 'Boolean');
    }
    return obj;
  }
}

/**
 * Allowed values for the <code>type</code> property.
 * @enum {String}
 * @readonly
 */
PermissionLookup.TypeEnum = {
  /**
   * value: "ORG"
   * @const
   */
  ORG: 'ORG',

  /**
   * value: "PROJECT"
   * @const
   */
  PROJECT: 'PROJECT',

  /**
   * value: "BRANCH"
   * @const
   */
  BRANCH: 'BRANCH',
};
/**
 * @member {module:model/PermissionLookup.TypeEnum} type
 */
PermissionLookup.prototype.type = undefined;

/**
 * @member {String} orgId
 */
PermissionLookup.prototype.orgId = undefined;

/**
 * @member {String} projectId
 */
PermissionLookup.prototype.projectId = undefined;

/**
 * @member {String} refId
 */
PermissionLookup.prototype.refId = undefined;

/**
 * Allowed values for the <code>privilege</code> property.
 * @enum {String}
 * @readonly
 */
PermissionLookup.PrivilegeEnum = {
  /**
   * value: "ORG_READ"
   * @const
   */
  ORG_READ: 'ORG_READ',

  /**
   * value: "ORG_EDIT"
   * @const
   */
  ORG_EDIT: 'ORG_EDIT',

  /**
   * value: "ORG_UPDATE_PERMISSIONS"
   * @const
   */
  ORG_UPDATE_PERMISSIONS: 'ORG_UPDATE_PERMISSIONS',

  /**
   * value: "ORG_READ_PERMISSIONS"
   * @const
   */
  ORG_READ_PERMISSIONS: 'ORG_READ_PERMISSIONS',

  /**
   * value: "ORG_CREATE_PROJECT"
   * @const
   */
  ORG_CREATE_PROJECT: 'ORG_CREATE_PROJECT',

  /**
   * value: "ORG_DELETE"
   * @const
   */
  ORG_DELETE: 'ORG_DELETE',

  /**
   * value: "PROJECT_READ"
   * @const
   */
  PROJECT_READ: 'PROJECT_READ',

  /**
   * value: "PROJECT_EDIT"
   * @const
   */
  PROJECT_EDIT: 'PROJECT_EDIT',

  /**
   * value: "PROJECT_READ_COMMITS"
   * @const
   */
  PROJECT_READ_COMMITS: 'PROJECT_READ_COMMITS',

  /**
   * value: "PROJECT_CREATE_BRANCH"
   * @const
   */
  PROJECT_CREATE_BRANCH: 'PROJECT_CREATE_BRANCH',

  /**
   * value: "PROJECT_DELETE"
   * @const
   */
  PROJECT_DELETE: 'PROJECT_DELETE',

  /**
   * value: "PROJECT_UPDATE_PERMISSIONS"
   * @const
   */
  PROJECT_UPDATE_PERMISSIONS: 'PROJECT_UPDATE_PERMISSIONS',

  /**
   * value: "PROJECT_READ_PERMISSIONS"
   * @const
   */
  PROJECT_READ_PERMISSIONS: 'PROJECT_READ_PERMISSIONS',

  /**
   * value: "PROJECT_CREATE_WEBHOOKS"
   * @const
   */
  PROJECT_CREATE_WEBHOOKS: 'PROJECT_CREATE_WEBHOOKS',

  /**
   * value: "BRANCH_READ"
   * @const
   */
  BRANCH_READ: 'BRANCH_READ',

  /**
   * value: "BRANCH_EDIT_CONTENT"
   * @const
   */
  BRANCH_EDIT_CONTENT: 'BRANCH_EDIT_CONTENT',

  /**
   * value: "BRANCH_DELETE"
   * @const
   */
  BRANCH_DELETE: 'BRANCH_DELETE',

  /**
   * value: "BRANCH_UPDATE_PERMISSIONS"
   * @const
   */
  BRANCH_UPDATE_PERMISSIONS: 'BRANCH_UPDATE_PERMISSIONS',

  /**
   * value: "BRANCH_READ_PERMISSIONS"
   * @const
   */
  BRANCH_READ_PERMISSIONS: 'BRANCH_READ_PERMISSIONS',
};
/**
 * @member {module:model/PermissionLookup.PrivilegeEnum} privilege
 */
PermissionLookup.prototype.privilege = undefined;

/**
 * @member {Boolean} allowAnonIfPublic
 */
PermissionLookup.prototype.allowAnonIfPublic = undefined;

/**
 * @member {Boolean} hasPrivilege
 */
PermissionLookup.prototype.hasPrivilege = undefined;