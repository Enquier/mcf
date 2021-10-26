/**
 * @classification UNCLASSIFIED
 *
 * @module controllers.api-controller
 *
 * @copyright Copyright (C) 2021, JPL/Caltech
 *
 * @license Apache-2.0
 *
 * @owner Charles E Galey
 *
 * @author Charles E Galey
 *
 * @description Defines the HTTP Rest API interface file. This file tightly
 * couples with the app/api-routes.js file.
 */

// Node modules


// NPM modules

// MBEE modules
const OrgController = M.require('controllers.organization-controller');
const User = M.require('models.user');

// API modules
const APIOrgController = M.require(`api.${M.config.api.strategy}.controllers.organization-controller`);
const APIFormatter = M.require(`api.${M.config.api.strategy}.lib.formatter`);

module.exports = {
  syncOrg,
  syncProject,
  syncBranch,
  syncElement,
  syncArtifact
};

/**
 * @description Syncronize orgs in MCF and API provider.
 *
 * @param {string} reqUser - The requesting user.
 * @param {object} apiOrgs - The orgs in an API format.
 * @param {object} mcfOrgs - The orgs in a MCF format.
 * @param {string} authority - An enumeration of who is the ultimate data authority,
 * values can be 'mcf' or 'api'.
 * @param {object} connect - An object containing any data required to authenticate
 * with the API provider.
 *
 * @returns {Promise[]} - A promise object with the completed updates to orgs.
 */
async function syncOrg(reqUser, apiOrgs, mcfOrgs, authority, connect) {
  // Private function to enable/manage Public MCF orgs.
  const handlePublicOrg = async (apiMcfOrg, mcfOrg) => {
    const users = await User.find({});
    // Set userIDs to the _id of the users array
    const userIDs = users.map(u => u._id);
    // Check if org is NOT null
    if (mcfOrg !== null) {
      // users currently in the database.
      Object.keys(mcfOrg.permissions)
      .forEach((user) => {
        if (!userIDs.includes(user)) {
          delete mcfOrg.permissions.user;
        }
      });

      return OrgController.updateOne({ _id: mcfOrg.id }, { permissions: mcfOrg.permissions });
    }
    else {
      // Add each existing user to default org
      userIDs.forEach((user) => {
        mcfOrg.permissions[user] = ['read', 'write'];
      });

      // Save new default organization
      OrgController.insertMany(mcfOrg).then(response => {
        M.log.info(`API Public Organization: ${mcfOrg.id} Created`);
        return response;
      });
    }
  };

  // Private Sync Function
  const sync = async (apiOrg, mcfOrg) => {
    const apiDate = Date.parse(apiOrg[`${APIFormatter.orgMap.updatedOn}`]);
    const mcfDate = Date.parse(mcfOrg.updatedOn);
    if (apiDate >= mcfDate) {
      M.log.info('Updating Org in MCF');
      try {
        const apiMcfOrg = APIFormatter.mcfOrg(apiOrg);

        if (apiOrg.public) {
          if (reqUser.admin) {
            return handlePublicOrg(apiMcfOrg, mcfOrg);
          }
          else {
            M.log.warn(`Error updating Public Org ${apiOrg.id} in MCF; Public Orgs must be updated by admin`);
            return null;
          }
        }
        else {
          return OrgController.update(reqUser, apiMcfOrg);
        }
      }
      catch (error) {
        M.log.warn(`Error updating Org ${apiOrg.id} in MCF`);
      }
    }
    else {
      try {
        return APIFormatter.mcfOrg(APIOrgController
        .update(reqUser, APIFormatter.apiOrg(mcfOrg), connect));
      }
      catch (error) {
        M.log.warn(`Error updating Org ${mcfOrg.id} in ${APIFormatter.namespace}`);
      }
    }
  };

  const orgs = [];
  // Syncing Logic
  if (apiOrgs.length >= mcfOrgs.length) {
    apiOrgs.forEach(apiOrg => {
      const mcfOrg = mcfOrgs.find(org => org.id === apiOrg.id);
      if ([mcfOrg].length < 1) {
        // Consider Creation/Deletion Logic
      }
      else {
        const updatedOrg = sync(apiOrg, mcfOrg);
        if (updatedOrg !== null) {
          orgs.push(updatedOrg);
        }
      }
    });
  }
  else {
    mcfOrgs.forEach(mcfOrg => {
      const apiOrg = apiOrgs.find(org => org.id === mcfOrg.id);
      if ([apiOrg].length < 1) {
        // Consider Deletion Logic
      }
      else {
        const updatedOrg = sync(apiOrg, mcfOrg);
        if (updatedOrg !== null) {
          orgs.push(updatedOrg);
        }
      }
    });
  }
  return orgs;
}

/**
 * @description Sync projects between MCF and API provider.
 */
function syncProject() {}

/**
 * @description Sync Branch between MCF and API provider.
 */
function syncBranch() {}

/**
 * @description Sync elements between MCF and API provider.
 */
function syncElement() {}

/**
 * @description Sync artifacts between MCF and API provider.
 */
function syncArtifact() {}
