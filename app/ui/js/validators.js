/**
 * @classification UNCLASSIFIED
 *
 * @module lib.validators
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Josh Kaplan
 * @author Austin Bieber
 * @author Connor Doyle
 * @author Phillip Lee
 *
 * @description This file defines validators - common regular expressions and
 * helper functions - used to validate data within MBEE.
 */
/* eslint-disable jsdoc/require-description-complete-sentence */
// Disabled to allow lists in descriptions

// MBEE modules
const utils = require('./utils');

const run = (customValidators, artifactVal) => {
  // If validators isn't defined, just set custom to an empty object.
  const _customValidators = customValidators || {};
  const _artifactVal = artifactVal || {};

  // This ID is used as the common regex for other ID fields in this module
  const defaultId = '([_a-zA-Z0-9])([-_a-zA-Z0-9.]){0,}';
  const defaultIdLength = 60;
  const defaultValidations = {
    id: defaultId,
    id_length: defaultIdLength,
    org_id: defaultId,
    org_id_length: defaultIdLength,
    project_id: defaultId,
    project_id_length: defaultIdLength,
    branch_id: defaultId,
    branch_id_length: defaultIdLength,
    artifact_id: defaultId,
    artifact_id_length: defaultIdLength,
    element_id: defaultId,
    element_id_length: defaultIdLength,
    user_username: '^([a-z])([a-z0-9_]){0,}$',
    user_username_length: defaultIdLength,
    user_email: '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$',
    user_fname: '^(([a-zA-Z])([-a-zA-Z ])*)?$',
    user_lname: '^(([a-zA-Z])([-a-zA-Z ])*)?$',
    url_next: '^(\\/)(?!\\/)',
    user_provider: null,
  };
  const defaultArtifactValidations = {
    location: '^[^.]+$',
    filename: '^[^!\\<>:"\'|?*]+$',
    extension: '^[^!\\<>:"\'|?*]+[.][\\w]+$',
  };
  // Apply custom validations to defaults.
  const validations = Object.assign(defaultValidations, _customValidators);
  const artifactValidations = Object.assign(defaultArtifactValidations, _artifactVal);
  // A list of reserved keywords which cannot be used in ids
  const reservedKeywords = ['css', 'js', 'img', 'doc', 'docs', 'webfonts',
    'login', 'about', 'assets', 'static', 'public', 'api', 'organizations',
    'orgs', 'projects', 'users', 'plugins', 'ext', 'extension', 'search',
    'whoami', 'profile', 'edit', 'proj', 'elements', 'branch', 'anonymous',
    'blob', 'artifact', 'artifacts', 'list'];

  // Create a validator function to test ids against the reserved keywords
  const reserved = (data) => {
    const parsedId = utils.parseID(data).pop();
    return !reservedKeywords.includes(parsedId);
  };

  // The custom data validator used in all models
  const customDataValidator = (v) =>
    // Must be an object and not null
    (typeof v === 'object' && v !== null);

  /**
   * @description Validator function for permissions on orgs and projects.
   *
   * @param {object} data - The data to validate.
   * @returns {boolean} Returns true if data is valid.
   */
  const permissionsValidator = (data) => {
    let bool = true;
    // If the permissions object is not a JSON object, reject
    if (typeof data !== 'object' || Array.isArray(data) || data === null) {
      bool = false;
    }
    // Check that each every key/value pair's value is an array of strings
    Object.values(data).forEach((val) => {
      if (!Array.isArray(val) || !val.every((s) => typeof s === 'string')) {
        bool = false;
      }
    });

    return bool;
  };

  /**
   * @description Regular Expressions to validate organization data and corresponding validator
   * functions.
   *
   * id:
   *   - MUST start with a lowercase letter, number or '_'
   *   - MUST only include lowercase letters, numbers, '_' or '-'
   *   - MUST be of length 1 or more
   *   Examples:
   *     - org1 [valid]
   *     - my-org [valid]
   *     - f81d4fae-7dec-11d0-a765-00a0c91e6bf6 [valid]
   *     - myOrg [invalid - uses uppercase letter]
   */
  const org = {
    id: validations.org_id,
    idLength: validations.org_id_length,
    _id: {
      reserved,
      match: (data) =>
        // If the ID is invalid, reject
        RegExp(org.id).test(data),
      maxLength: (data) =>
        // If the ID is longer than max length, reject
        data.length <= org.idLength,
      minLength: (data) =>
        // If the ID is shorter than min length, reject
        data.length > 1,

    },
    permissions: permissionsValidator,
    custom: customDataValidator,
  };

  /**
   * @description Regular Expressions to validate project data
   * and corresponding validator functions.
   *
   * id:
   *   - MUST start with a lowercase letter, number or '_'
   *   - MUST only include lowercase letters, numbers, '_' or '-'
   *   - Must be of length 1 or more
   *   - The following reserved words are not valid: "edit"
   *   Examples:
   *      - project1 [valid]
   *      - my-project [valid]
   *      - f81d4fae-7dec-11d0-a765-00a0c91e6bf6 [valid]
   *      - -project [invalid - must start with a letter or a number]
   *      - myProject [invalid - cannot use uppercase characters]
   */
  const project = {
    id: `${org.id.slice(0, -1)}${utils.ID_DELIMITER}${validations.project_id}$`,
    idLength: org.idLength + utils.ID_DELIMITER.length + validations.project_id_length,
    _id: {
      reserved,
      match: (data) =>
        // If the ID is invalid, reject
        RegExp(project.id).test(data),
      maxLength: (data) =>
        // If the ID is longer than max length, reject
        data.length <= project.idLength,
      minLength: (data) =>
        // If the ID is shorter than min length, reject
        data.length > 4,

    },
    org: org._id.match,
    permissions: permissionsValidator,
    custom: customDataValidator,
  };

  /**
   * @description Regular Expressions to validate branch data and corresponding validator functions.
   *
   * id:
   *   - MUST start with a lowercase letter, number or '_'
   *   - MUST only include lowercase letters, numbers, '_' or '-'
   *   - each segment MUST be of length 1 or more
   *   Examples:
   *      - orgid:projectid:branchid [valid]
   *      - orgid:projectid:my-branch [valid]
   *      - orgid:projectid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6 [valid]
   *      - orgid:projectid:-branch[invalid - must start with a letter or a number]
   *      - orgid:projectid:myBranch [invalid - cannot use uppercase characters]
   *      - my-branch [invalid - must contain org and proj segments]
   */
  const branch = {
    id: `${project.id.slice(0, -1)}${utils.ID_DELIMITER}${validations.branch_id}$`,
    idLength: project.idLength + utils.ID_DELIMITER.length + validations.branch_id_lengt,
    _id: {
      reserved,
      match: (data) =>
        // If the ID is invalid, reject
        RegExp(branch.id).test(data),
      maxLength: (data) =>
        // If the ID is longer than max length, reject
        data.length <= branch.idLength,
      minLength: (data) =>
        // If the ID is shorter than min length, reject
        data.length > 7,

    },
    project: project._id.match,
    source: (data) =>
      // Allow either null or a matching id
      data === null || RegExp(branch.id).test(data),
    custom: customDataValidator,
  };

  /**
   * @description Regular Expressions to validate artifact data and corresponding validator
   * functions.
   *
   * id:
   *   - MUST start with a lowercase letter, number or '_'
   *   - MUST only include lowercase letters, numbers, '_' or '-'
   *   - each segment MUST be of length 1 or more
   *   Examples:
   *      - orgid:projectid:branchid:artifactid [valid]
   *      - orgid:projectid:branchid:my-artifact [valid]
   *      - orgid:projectid:branchid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6 [valid]
   *      - orgid:projectid:branchid:-artifact [invalid - must start with a letter or a number]
   *      - orgid:projectid:branchid:myArtifact [invalid - cannot use uppercase characters]
   *      - my-artifact [invalid - must contain org, proj, and branch segments]
   */
  const artifact = {
    id: `${branch.id.slice(0, -1)}${utils.ID_DELIMITER}${validations.artifact_id}$`,
    idLength: branch.idLength + utils.ID_DELIMITER.length + validations.artifact_id_length,
    locationRegEx: artifactValidations.location,
    filenameRegEx: artifactValidations.filename,
    extension: artifactValidations.extension,
    _id: {
      reserved,
      match: (data) =>
        // If the ID is invalid, reject
        RegExp(artifact.id).test(data),
      optionalMatch: (data) =>
        // Allow either null or a matching id
        data === null || RegExp(artifact.id).test(data),
      maxLength: (data) =>
        // If the ID is longer than max length, reject
        data.length <= artifact.idLength,
      minLength: (data) =>
        // If the ID is shorter than min length, reject
        data.length > 10,

    },
    project: project._id.match,
    branch: branch._id.match,
    filename: (data) =>
      // If the filename is improperly formatted, reject
      (RegExp(artifact.filenameRegEx).test(data)
        && RegExp(artifact.extension).test(data)),
    location: (data) =>
      // If the location is improperly formatted, reject
      RegExp(artifact.locationRegEx).test(data),

  };

  /**
   * @description Regular Expressions to validate element data
   * and corresponding validator functions.
   *
   * id:
   *   - MUST start with a lowercase letter, number or '_'
   *   - MUST only include lowercase letters, numbers, '_' or '-'
   *   - each segment MUST be of length 2 or more
   *   Examples:
   *      - orgid:projectid:branchid:elementid [valid]
   *      - orgid:projectid:branchid:my-element [valid]
   *      - orgid:projectid:branchid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6 [valid]
   *      - orgid:projectid:branchid:-element [invalid - must start with a letter or a number]
   *      - orgid:projectid:branchid:myElement [invalid - cannot use uppercase characters]
   *      - my-element [invalid - must contain org, proj, and branch segments]
   */
  const element = {
    id: `${branch.id.slice(0, -1)}${utils.ID_DELIMITER}${validations.element_id}$`,
    idLength: branch.idLength + utils.ID_DELIMITER.length + validations.element_id_length,
    custom: customDataValidator,
    _id: {
      reserved,
      match: (data) =>
        // If the ID is invalid, reject
        RegExp(element.id).test(data),
      optionalMatch: (data) =>
        // Allow either null or a matching id
        data === null || RegExp(element.id).test(data),
      maxLength: (data) =>
        // If the ID is longer than max length, reject
        data.length <= element.idLength,
      minLength: (data) =>
        // If the ID is shorter than min length, reject
        data.length > 10,

    },
    project: project._id.match,
    branch: branch._id.match,
    artifact: () => artifact._id.optionalMatch,
  };
  // Define parent, source, and target after so that they can access element._id.optionalMatch
  element.parent = element._id.optionalMatch;
  element.source = {
    id: element._id.optionalMatch,
    target: (data) => {
      // If source is provided
      if (data) {
        // Reject if target is null
        return this.target;
      }
      // Source null, return true
      return true;
    },
  };
  element.target = {
    id: element._id.optionalMatch,
    source: (data) => {
      // If target is provided
      if (data) {
        // Reject if source is null
        return this.source;
      }
      // Target null, return true
      return true;
    },
  };

  /**
   * @description Regular Expressions to validate user data
   *
   * username:
   *   - MUST start with a lowercase letter
   *   - MUST only include lowercase letters, numbers, or underscores
   *   - MUST be of length 1 or more
   * email:
   *   - MUST be a valid email address
   * name:
   *   - MUST start with a lowercase letter or uppercase letter
   *   - MUST only contain lowercase letters, uppercase letters, '-', or whitespace
   */
  const user = {
    username: validations.user_username,
    usernameLength: validations.user_username_length,
    email: validations.user_email,
    firstName: validations.user_fname,
    lastName: validations.user_lname,
    _id: {
      reserved,
      match: (data) =>
        // If the username is invalid, reject
        RegExp(user.username).test(data),
      maxLength: (data) =>
        // If the username is longer than max length, reject
        data.length <= user.usernameLength,
      minLength: (data) =>
        // If the username is shorter than min length, reject
        data.length > 2,

    },
    fname: (data) =>
      // If the fname is invalid and provided, reject
      !(!RegExp(user.firstName).test(data) && data),
    preferredName: (data) =>
      // If the fname is invalid and provided, reject
      !(!RegExp(user.firstName).test(data) && data),
    lname: (data) =>
      // If the fname is invalid and provided, reject
      !(!RegExp(user.lastName).test(data) && data),
    provider: (data) =>
      // If the user provider is defined and does not include value, return false
      !(validations.user_provider && !validations.user_provider.includes(data)),
    custom: customDataValidator,
  };

  /**
   * @description Functions to validate webhook data
   *
   * type:
   *   - Must be either the string "Outgoing" or "Incoming"
   * triggers:
   *   - MUST be an array of strings
   * responses:
   *   - MUST be an array of objects that have at least a url field
   * token:
   *   - MUST be a string
   * tokenLocation:
   *   - MUST be a string
   */
  const webhook = {
    type: {
      outgoing: (data) =>
        // An outgoing webhook must have a url field and cannot have a tokenLocation.
        (data === 'Outgoing'
          ? typeof this.url === 'string' && !this.tokenLocation
          : true),
      incoming: (data) =>
        // An incoming webhook must have a token and tokenLocation and cannot have a url field.
        (data === 'Incoming'
          ? (typeof this.token === 'string' && typeof this.tokenLocation === 'string')
          && this.url === undefined
          : true),

    },
    triggers: (data) => Array.isArray(data) && data.every((s) => typeof s === 'string'),
    url: (data) => typeof data === 'string',
    token: (data) =>
      // Protect against null entries
      typeof data === 'string',
    tokenLocation: (data) =>
      // Protect against null entries
      typeof data === 'string',
    reference: (data) => (data === '' || RegExp(org.id).test(data)
        || RegExp(project.id).test(data) || RegExp(branch.id).test(data)),
  };

  /**
   * @description Regular Expressions to validate url data
   *
   * next:
   *   - MUST start with one and only one '/'
   *   Examples:
   *     - /login [valid]
   *     - https://lockheedmartin.com [invalid - cannot use external URLs]
   */
  const url = {
    // starts with one and only one '/'
    next: validations.url_next || '^(\/)(?!\/)', // eslint-disable-line no-useless-escape
  };

  return {
    org,
    project,
    branch,
    artifact,
    element,
    user,
    webhook,
    url,
    id: defaultId,
    idLength: defaultIdLength,
    ID_DELIMITER: utils.ID_DELIMITER,
  };
};

module.exports = {
  run,
};
