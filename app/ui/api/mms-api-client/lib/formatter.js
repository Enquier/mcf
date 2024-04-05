/**
 * @classification UNCLASSIFIED
 *
 * @module src.formatter
 *
 * @license
 * Copyright 2020 Lockheed Martin Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @owner Connor Doyle
 *
 * @author Austin Bieber
 * @author Leah De Laurell
 *
 * @description Exports functions which format MDK requests into MCF-friendly objects
 * and MCF objects into MMS objects.
 */

/* ESLint Modifications for MMS */
/* eslint-disable no-underscore-dangle */

// Local Modules
const utils = require('../../../js/utils');
const { getPublicData } = require('./get-public-data');

// Adapter modules
const namespace = 'mms';

/**
 * @description Formats an MMS org into an MCF org.
 *
 * @param {object} mmsOrgOb - The MMS orgs response to format.
 *
 * @returns {object} The formatted orgs array.
 */
function mcfOrg(mmsOrgOb) {
  // Define known MCF fields
  const knownKeys = ['id', 'name', 'custom'];
  const { orgs } = mmsOrgOb;
  for (let i = 0; i < orgs.length; i += 1) {
    // Define the custom data field
    orgs[i].custom = {
      [namespace]: {},
    };

    // Add extra keys to custom data
    Object.keys(orgs[i]).forEach((k) => {
      if (!knownKeys.includes(k)) {
        orgs[i].custom[namespace][k] = orgs[i][k];
        delete orgs[i][k];
      }
    });
  }

  return orgs;
}

/**
 * @description Formats an MMS project into an MCF project.
 *
 * @param {object} mmsProjOb - The project to format.
 *
 * @returns {object} The formatted project.
 */
function mcfProject(mmsProjOb) {
  // Define known MCF fields
  const knownKeys = ['id', 'name', 'custom', 'orgId', '_modified', '_creator', '_created', '_modifier'];
  const { projects } = mmsProjOb;
  const mcfProjects = [];
  for (let i = 0; i < projects.length; i += 1) {
    // Define the custom data field
    const proj = projects[i];
    const project = {
      type: 'Project',
      name: proj.name,
      id: proj.id,
      createdBy: proj._creator,
      createdOn: proj._created,
      lastModifiedBy: (proj._modifier) ? proj._modifier : null,
      updatedOn: (proj._modified) ? proj._modified : null,
      org: proj.orgId,
    };
    project.custom = {
      [namespace]: {},
    };

    // Add extra keys to custom data
    Object.keys(projects[i]).forEach((k) => {
      if (!knownKeys.includes(k)) {
        project.custom[namespace][k] = projects[i][k];
      }
    });
    mcfProjects.push(project);
  }

  return mcfProjects;
}

/**
 * @description Formats an MMS ref into an MCF branch.
 *
 * @param {object} branch - The branch to format.
 *
 * @returns {object} The formatted branch.
 */
function mcfBranch(ref) {
  const r = ref;
  // Define known MCF fields
  const knownKeys = ['id', 'name', 'source', 'custom'];

  // Define the custom data field
  r.custom = {
    [namespace]: {},
  };

  if (r.id !== 'master') r.source = r.parentRefId;

  // Add extra keys to custom data
  Object.keys(r).forEach((k) => {
    if (!knownKeys.includes(k)) {
      r.custom[namespace][k] = r[k];
      delete r[k];
    }
  });

  return r;
}

/**
 * @description Formats an MMS element into an MCF element.
 * @async
 *
 * @param {object} req - The request object. Used for its orgid, projectid, and refid parameters.
 * @param {object} elements - The elements to format.
 *
 * @returns {object} The formatted element.
 */
async function mcfElements(req, elements) {
  const mcfFields = ['id', 'name', 'documentation', 'type', 'parent', 'source', 'target', 'project', 'branch', 'artifact', 'custom'];
  const promises = [];

  elements.forEach((data) => {
    const elem = data;
    elem.custom = {
      [namespace]: {},
    };
    Object.keys(elem).forEach((field) => {
      // Handle ownerId/parent
      if (field === 'ownerId' && elem[field] !== undefined && elem[field] !== null) {
        elem.parent = elem.ownerId;
        // Check if the parent is also being created
        // if (!elements.map((e) => e.id).includes(elem.parent)) {
        //   promises.push(ElementController.find(req.user, req.params.orgid, req.params.projectid,
        //     req.params.refid, elem.parent)
        //   .then((parent) => {
        //     if (parent.length === 0) delete elem.parent;
        //   }));
        // }
      }

      if (!mcfFields.includes(field)) {
        elem.custom[namespace][field] = elem[field];
        delete elem[field];
      }
    });
    // Sometimes Cameo wants to store the value as null
    if (elem.target === null) {
      elem.custom[namespace].target = null;
      delete elem.target;
    }
    // Sometimes Cameo wants to store nothing; null for these fields will result in the fields
    // not being returned in mmsElement()
    if (!elem.name) {
      elem.custom[namespace].name = null;
    }
    if (!elem.documentation) {
      elem.custom[namespace].documentation = null;
    }
  });

  await Promise.all(promises);
}

/**
 * @description Formats an MCF org into an MMS org.
 *
 * @param {object} reqUser - The requesting user.
 * @param {object} orgObj - The MCF org to format.
 *
 * @returns {object} An MMS formatted org.
 */
function mmsOrg(reqUser, orgObj) {
  // Get the public data of the org
  const org = getPublicData(reqUser, orgObj, 'org');

  return {
    id: org.id,
    name: org.name,
  };
}

/**
 * @description Formats an MCF project into an MMS project.
 *
 * @param {object} reqUser - The requesting user.
 * @param {object} projObj - The MCF project to format.
 *
 * @returns {object} An MMS formatted project.
 */
function mmsProject(reqUser, projObj) {
  // Get the public data of the project
  const proj = getPublicData(reqUser, projObj, 'project');

  const project = {};

  if (proj.id) project.id = proj.id;
  if (proj.name) project.name = proj.name;
  if (proj.org) project.orgId = projObj.org;
  if (proj.custom[namespace].public) project.public = proj.custom[namespace].public;
  //  of the project / reevaluate this
  // project.categoryId = null;
  // project._mounts = [];
  //
  // project._editable = true;

  // if (proj.custom && proj.custom[namespace]) {
  //   Object.keys(proj.custom[namespace]).forEach((field) => {
  //     project[field] = proj.custom[namespace][field];
  //   });
  // }

  return { projects: project };
}

/**
 * @description Formats an MCF branch into an MMS ref.
 *
 * @param {object} reqUser - The requesting user.
 * @param {object} branchObj - The MCF branch to format.
 *
 * @returns {object} An MMS formatted ref.
 */
function mmsRef(reqUser, branchObj) {
  // Get the public data of the branch
  const publicBranch = getPublicData(reqUser, branchObj, 'branch');

  const branch = {
    id: publicBranch.id,
    name: publicBranch.name,
    type: (publicBranch.tag) ? 'tag' : 'Branch',
    parentRefId: (publicBranch.source) ? publicBranch.source : 'master',
    _modifier: publicBranch.lastModifiedBy,
  };

  if (publicBranch.custom && publicBranch.custom[namespace]) {
    Object.keys(publicBranch.custom[namespace]).forEach((field) => {
      branch[field] = publicBranch.custom[namespace][field];
    });
  }

  return branch;
}

/**
 * @description Formats an MCF element into an MMS element.
 *
 * @param {object} reqUser - The requesting user.
 * @param {object} elemObj - The MCF element to format.
 *
 * @returns {object} An MMS formatted element.
 */
function mmsElement(reqUser, elemObj) {
  // Get the public data of the element
  const elemPublicData = getPublicData(reqUser, elemObj, 'element');

  const elem = {
    id: elemPublicData.id,
    documentation: elemPublicData.documentation,
    type: elemPublicData.type,
    ownerId: (elemPublicData.parent === null)
      ? null
      : utils.parseID(elemPublicData.parent).pop(),
    name: elemPublicData.name,
    _projectId: utils.parseID(elemPublicData.project).pop(),
    _refId: utils.parseID(elemPublicData.branch).pop(),
    _creator: elemPublicData.createdBy,
    _created: elemPublicData.createdOn,
    _modifier: elemPublicData.lastModifiedBy,
    _modified: elemPublicData.updatedOn,
    _editable: true,
  };

  // Handle custom
  if (typeof elemObj.custom[namespace] === 'object') {
    Object.keys(elemObj.custom[namespace]).forEach((field) => {
      elem[field] = elemObj.custom[namespace][field];
    });
  }

  // Remove the name if it was set to null
  if (elem.name === null) {
    delete elem.name;
  }
  // Remove the documentation if it was set to null
  if (elem.documentation === null) {
    delete elem.documentation;
  }

  return elem;
}

/**
 * @description Formats an MCF artifact into an MMS artifact.
 *
 * @param {object} reqUser - The requesting user.
 * @param {object} artifact - The MCF artifact to format.
 *
 * @returns {object} An MMS formatted artifact.
 */
function mmsArtifact(reqUser, artifact) {
  // Get the public data of the artifact
  const artPublicData = getPublicData(reqUser, artifact, 'artifact');

  const projID = utils.parseID(artPublicData.project).pop();
  const refID = utils.parseID(artPublicData.branch).pop();

  const returnObj = {
    id: artPublicData.id,
    location: artPublicData.location,
    filename: artPublicData.filename,
    artifactLocation: `/projects/${projID}/refs/${refID}/artifacts/blob/${artPublicData.id}`,
    _projectId: projID,
    _refId: refID,
    _creator: artPublicData.createdBy,
    _created: artPublicData.createdOn,
    _modifier: artPublicData.lastModifiedBy,
    _modified: artPublicData.updatedOn,
    _editable: true,
  };

  // Handle custom
  Object.keys(artifact.custom[namespace]).forEach((field) => {
    returnObj[field] = artifact.custom[namespace][field];
  });

  return returnObj;
}

/**
 * @description Formats an MMS User into an MCF compatible one.
 *
 * @param {object} response - The body of the MMS User response.
 *
 * @returns {object} - MCF Compatible user.
 */
function mcfUser(mmsUsersOb) {
  const { users } = mmsUsersOb;
  const mcfUsers = [];
  for (let i = 0; i < users.length; i += 1) {
    mcfUsers.push({
      username: users[i].username,
      fname:  (users[i].firstName) ? users[i].firstName : '',
      lname: (users[i].lastName) ? users[i].lastName : '',
      preferredName: (users[i].preferredName) ? users[i].preferredName : (users[i].firstName) ? users[i].firstName : '',
      email: (users[i].email) ? users[i].email : '',
      custom: (users[i].custom) ? users[i].custom : {},
      admin: users[i].admin,
      provider: users[i].type,
      changePassword: (users[i].type === 'local'),
      createdOn: users[i].created,
      updatedOn: users[i].modified,
      enabled: users[i].enabled,
    });
  }
  return mcfUsers;
}

function mcfPermission(mmsPermissionObj, formatOpts) {
  const { user, isPublic = false } = formatOpts;
  const permission = {};
  const { type } = mmsPermissionObj.lookups[0];
  const read = 'read';
  const write = 'write';
  const admin = 'admin';
  const mmsPerm = {
    read: `${type}_READ`,
    write: `${type}_EDIT${type === 'BRANCH' ? '_CONTENT' : ''}`,
    admin: `${type}_UPDATE_PERMISSIONS`,
  };
  permission[user.username] = [];
  const result = {};
  mmsPermissionObj.lookups.forEach((perm) => {
    result[perm.privilege] = perm.hasPrivilege;
  });

  if (result[mmsPerm.admin]) {
    permission[user.username] = admin;
  } else if (result[mmsPerm.write]) {
    permission[user.username] = write;
  } else if (result[mmsPerm.read] || isPublic) {
    permission[user.username] = read;
  } else {
    permission[user.username] = '';
  }
  return permission;
}

/**
 * @description Formats an MMS response of specified Type into an MCF-UI compatible one.
 *
 * @param {object} response - Body of the response from the server.
 * @param {string} type - Type of request for switch.
 * @param formatOpts - Options for modifying how formatting is handled
 *
 * @returns {{name, id}|*} - MCF-UI Compatible Object.
 */
function formatResponse(response, type, formatOpts) {
  let opts = formatOpts;
  if (!formatOpts) {
    opts = {};
  }
  opts.user = JSON.parse(window.sessionStorage.getItem('mbee-user'));
  switch (type) {
    case 'org':
      return mcfOrg(response, opts);

    case 'project':
      return mcfProject(response, opts);

    case 'element':
      return mcfElements(response, opts);

    case 'branch':
      return mcfBranch(response, opts);

    case 'user':
      return mcfUser(response, opts);

    case 'permission':
      return mcfPermission(response, opts);

    case 'artifact':
    default:
      return response;
  }
}

/**
 * @description Formats an MCF-UI request of specified Type into an MMS compatible one.
 *
 * @param {object} request - Body of the request from the webApp.
 * @param {string} type - Type of request for switch.
 *
 * @returns {{name, id}|*} - MCF-UI Compatible Object.
 */
function formatRequest(request, type) {
  const user = JSON.parse(window.sessionStorage.getItem('mbee-user'));
  switch (type) {
    case 'org':
      return mmsOrg(user, request);

    case 'project':
      return mmsProject(user, request);

    case 'element':
      return mmsElement(user, request);

    case 'branch':
      return mmsRef(user, request);

    case 'artifact':
      return mmsArtifact(user, request);

    default:
      return request;
  }
}

export default {
  formatResponse,
  formatRequest,
};
