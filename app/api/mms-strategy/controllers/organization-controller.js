/**
 * @classification UNCLASSIFIED
 *
 * @module controllers.mms-strategy.organization-controller
 *
 * @copyright Copyright (C) 2021, JPL/Caltech
 *
 * @license Apache-2.0
 *
 * @owner Charles E Galey
 *
 * @author Charles E Galey
 *
 * @description Provides an abstraction layer on top of the Organization model
 * that provides functions implementing controller logic and behavior.
 */

// Expose organization controller functions
// Note: The export is being done before the import to solve the issues of
// circular references between controllers.
module.exports = {
  find,
  create,
  update,
  createOrUpdate,
  // remove
};

// Node modules
const axios = require('axios');

// MCF modules

// MMS modules

const config = M.config.api.mms;
const mmsUrl = () => {
  let url = `${config.url}:${config.port}`;
  if (!config.port) {
    url = `${config.url}`;
  }
  return url;
};

/**
 * @description This function finds one or many organizations. Depending on the
 * given parameters, this function can find a single org by ID, multiple orgs by ID,
 * or all orgs in the system. Only organizations which a user has read access to
 * will be returned.
 *
 * @param {User} requestingUser - The object containing the requesting user.
 * @param {(string|string[])} [orgIds] - The organizations to find. Can either be
 * an array of org ids, a single org id, or not provided, which defaults to
 * every org being found.
 * @param {object} [options] - A parameter that provides supported options.
 * @param {string[]} [options.populate] - A list of fields to populate on return of
 * the found objects. By default, no fields are populated.
 * @param {boolean} [options.includeArchived = false] - If true, find results will include
 * archived objects.
 * @param {string[]} [options.fields] - An array of fields to return. By default
 * includes the _id and id fields. To NOT include a field, provide a '-' in
 * front.
 * @param {number} [options.limit = 0] - A number that specifies the maximum
 * number of documents to be returned to the user. A limit of 0 is equivalent to
 * setting no limit.
 * @param {number} [options.skip = 0] - A non-negative number that specifies the
 * number of documents to skip returning. For example, if 10 documents are found
 * and skip is 5, the first 5 documents will NOT be returned.
 * @param {string} [options.sort] - Provide a particular field to sort the results by.
 * You may also add a negative sign in front of the field to indicate sorting in
 * reverse order.
 * @param {string} [options.name] - Search for orgs with a specific name.
 * @param {string} [options.createdBy] - Search for orgs with a specific
 * createdBy value.
 * @param {string} [options.lastModifiedBy] - Search for orgs with a specific
 * lastModifiedBy value.
 * @param {string} [options.archived] - Search only for archived orgs.  If false,
 * only returns unarchived orgs.  Overrides the includeArchived option.
 * @param {string} [options.archivedBy] - Search for orgs with a specific
 * archivedBy value.
 * @param {string} [options.custom....] - Search for any key in custom data. Use
 * dot notation for the keys. Ex: custom.hello = 'world'.
 * @param {object} [connect] - A parameter that provides connection information for
 * the strategy.
 * @param {string} [connect.token] - The credentials passed from the user to
 * authenticate with MCF (in the case of a plugin loopback.
 * @param {string} [connect.protocol] - The protocol that shoudl be used to connect
 * to the external store.
 * @param {string} [connect.mms_token] - The credentials passed from the user to
 * authenticate with MMS.
 *
 * @returns {Promise<object[]>} Array of found organization objects.
 *
 * @example
 * find({User}, ['org1', 'org2'], { populate: 'createdBy' })
 * .then(function(orgs) {
 *   // Do something with the found orgs
 * })
 * .catch(function(error) {
 *   M.log.error(error);
 * });
 */
async function find(requestingUser, orgIds, options, connect) {
  try {
    const url = `${mmsUrl}/orgs`;
    const orgs = await axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${connect.token}`,
      },
    });
    if (orgIds !== null) {
      return orgIds.forEach((orgId) => {
        const foundOrg = orgs.data.orgs.find((org) => org.id === orgId);
        if ([foundOrg].length < 1) {
          M.log.warn(`Unable to find org: ${orgId} in MMS, skipping.`);
        }
      });
    }

    return orgs.data.orgs;
  } catch (error) {
    M.log.error(error);
    throw new M.ServerError('Error getting organization from MMS');
  }
}

/**
 * @description This functions calls the common createOrUpdate function of MMS
 * to create one or more organizations.
 *
 * @param {User} requestingUser - The object containing the requesting user.
 * @param {(object|object[])} orgs - Either an array of objects containing org
 * data or a single object containing org data to create.
 * @param {string} orgs.id - The ID of the org being created.
 * @param {string} orgs.name - The organization name.
 * @param {object} [orgs.custom] - Any additional key/value pairs for an object.
 * Must be proper JSON form.
 * @param {object} [orgs.permissions] - Any preset permissions on the org. Keys
 * should be usernames and values should be the highest permissions the user
 * has. NOTE: The requesting user gets added as an admin by default.
 * @param {object} [options] - A parameter that provides supported options.
 * @param {string[]} [options.populate] - A list of fields to populate on return of
 * the found objects. By default, no fields are populated.
 * @param {string[]} [options.fields] - An array of fields to return. By default
 * includes the _id and id fields. To NOT include a field, provide a '-' in
 * front.
 * @param {object} [connect] - A parameter that provides connection information for
 * the strategy.
 * @param {string} [connect.token] - The credentials passed from the user to
 * authenticate with MCF (in the case of a plugin loopback.
 * @param {string} [connect.protocol] - The protocol that shoudl be used to connect
 * to the external store.
 * @param {string} [connect.mms_token] - The credentials passed from the user to
 * authenticate with MMS.
 * @returns {Promise<object[]>} Array of created organization objects.
 *
 * @example
 * create({User}, [{Org1}, {Org2}, ...], { populate: 'createdBy' })
 * .then(function(orgs) {
 *   // Do something with the newly created orgs
 * })
 * .catch(function(error) {
 *   M.log.error(error);
 * });
 */
async function create(requestingUser, orgs, options, connect) {
  return createOrUpdate(requestingUser, orgs, options, connect);
}

/**
 * @description This functions calls the common createOrUpdate function of MMS to
 * update one or more organizations.
 *
 * @param {User} requestingUser - The object containing the requesting user.
 * @param {(object|object[])} orgs - Either an array of objects containing org
 * data or a single object containing org data to create.
 * @param {string} orgs.id - The ID of the org being created.
 * @param {string} orgs.name - The organization name.
 * @param {object} [orgs.custom] - Any additional key/value pairs for an object.
 * Must be proper JSON form.
 * @param {object} [orgs.permissions] - Any preset permissions on the org. Keys
 * should be usernames and values should be the highest permissions the user
 * has. NOTE: The requesting user gets added as an admin by default.
 * @param {object} [options] - A parameter that provides supported options.
 * @param {string[]} [options.populate] - A list of fields to populate on return of
 * the found objects. By default, no fields are populated.
 * @param {string[]} [options.fields] - An array of fields to return. By default
 * includes the _id and id fields. To NOT include a field, provide a '-' in
 * front.
 * @param {object} [connect] - A parameter that provides connection information for
 * the strategy.
 * @param {string} [connect.token] - The credentials passed from the user to
 * authenticate with MCF (in the case of a plugin loopback.
 * @param {string} [connect.protocol] - The protocol that shoudl be used to connect
 * to the external store.
 * @param {string} [connect.mms_token] - The credentials passed from the user to
 * authenticate with MMS.
 * @returns {Promise<object[]>} Array of created organization objects.
 *
 * @example
 * create({User}, [{Org1}, {Org2}, ...], { populate: 'createdBy' })
 * .then(function(orgs) {
 *   // Do something with the newly created orgs
 * })
 * .catch(function(error) {
 *   M.log.error(error);
 * });
 */
async function update(requestingUser, orgs, options, connect) {
  return createOrUpdate(requestingUser, orgs, options, connect);
}

/**
 * @description This functions creates or updates one or many orgs from the provided data.
 *
 * @param {User} requestingUser - The object containing the requesting user.
 * @param {(object|object[])} orgs - Either an array of objects containing org
 * data or a single object containing org data to create.
 * @param {string} orgs.id - The ID of the org being created.
 * @param {string} orgs.name - The organization name.
 * @param {object} [orgs.custom] - Any additional key/value pairs for an object.
 * Must be proper JSON form.
 * @param {object} [orgs.permissions] - Any preset permissions on the org. Keys
 * should be usernames and values should be the highest permissions the user
 * has. NOTE: The requesting user gets added as an admin by default.
 * @param {object} [options] - A parameter that provides supported options.
 * @param {string[]} [options.populate] - A list of fields to populate on return of
 * the found objects. By default, no fields are populated.
 * @param {string[]} [options.fields] - An array of fields to return. By default
 * includes the _id and id fields. To NOT include a field, provide a '-' in
 * front.
 * @param {object} [connect] - A parameter that provides connection information for
 * the strategy.
 * @param {string} [connect.token] - The credentials passed from the user to
 * authenticate with MCF (in the case of a plugin loopback.
 * @param {string} [connect.protocol] - The protocol that shoudl be used to connect
 * to the external store.
 * @param {string} [connect.mms_token] - The credentials passed from the user to
 * authenticate with MMS.
 * @returns {Promise<object[]>} Array of created organization objects.
 *
 * @example
 * create({User}, [{Org1}, {Org2}, ...], { populate: 'createdBy' })
 * .then(function(orgs) {
 *   // Do something with the newly created orgs
 * })
 * .catch(function(error) {
 *   M.log.error(error);
 * });
 */
async function createOrUpdate(requestingUser, orgs, options, connect) {
  orgs.forEach((org) => {
    const { port } = M.config.server[connect.protocol];
    const requestOptions = {
      url: `${connect.protocol}://${M.config.server.commitURL}:${port}/plugins/mms-adapter/alfresco/service/mms-org`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${connect.token}`,
        'MMS-TOKEN': connect.mms_token,
      },
      method: 'post',
      data: org,
    };

    axios(requestOptions).then((response) => {
      if (response.status !== 200) {
        throw new M.ServerError('Issue creating MMS org');
      }
      return response.data.orgs;
    });
  });
}
