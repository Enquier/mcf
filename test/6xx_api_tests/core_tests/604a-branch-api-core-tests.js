/**
 * @classification UNCLASSIFIED
 *
 * @module test.604a-branch-api-core-tests
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Leah De Laurell
 * @author Phillip Lee
 *
 * @description This tests the branch API controller functionality:
 * GET, POST, PATCH, and DELETE of a branch.
 */

// NPM modules
const chai = require('chai');
const axios = require('axios');

// MBEE modules
const utils = M.require('lib.utils');
const jmi = M.require('lib.jmi-conversions');

/* --------------------( Test Data )-------------------- */
// Variables used across test functions
const testUtils = M.require('lib.test-utils');
const testData = testUtils.importTestData('test_data.json');
const test = M.config.test;
let org = null;
let adminUser = null;
let projID = null;

/* --------------------( Main )-------------------- */
/**
 * The "describe" function is provided by Mocha and provides a way of wrapping
 * or grouping several "it" tests into a single group. In this case, the name of
 * that group (the first parameter passed into describe) is derived from the
 * name of the current file.
 */
describe(M.getModuleName(module.filename), () => {
  /**
   * Before: Create admin, organization, and project.
   */
  before(async () => {
    try {
      adminUser = await testUtils.createTestAdmin();
      org = await testUtils.createTestOrg(adminUser);
      const proj = await testUtils.createTestProject(adminUser, org._id);
      projID = utils.parseID(proj._id).pop();
    }
    catch (error) {
      M.log.error(error);
      // Expect no error
      chai.expect(error.message).to.equal(null);
    }
  });

  /**
   * After: Delete organization and admin user.
   */
  after(async () => {
    try {
      await testUtils.removeTestOrg();
      await testUtils.removeTestAdmin();
    }
    catch (error) {
      M.log.error(error);
      // Expect no error
      chai.expect(error).to.equal(null);
    }
  });

  /* Execute the tests */
  it('should POST a branch.', postBranch);
  it('should POST multiple branches.', postBranches);
  it('should GET a branch.', getBranch);
  it('should GET multiple branches.', getBranches);
  it('should PATCH a branch', patchBranch);
  it('should PATCH multiple branches.', patchBranches);
  it('should DELETE a branch.', deleteBranch);
  it('should DELETE multiple branches', deleteBranches);
});

/* --------------------( Tests )-------------------- */
/**
 * @description Verifies POST
 * /api/orgs/:orgid/projects/:projectid/branches/:branchid
 * creates a single branch.
 */
async function postBranch() {
  try {
    const branchData = testData.branches[1];
    const options = {
      method: 'post',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches/${branchData.id}`,
      headers: testUtils.getHeaders(),
      data: branchData
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const createdBranch = res.data[0];

    // Verify branch created properly
    chai.expect(createdBranch.id).to.equal(branchData.id);
    chai.expect(createdBranch.name).to.equal(branchData.name);
    chai.expect(createdBranch.custom || {}).to.deep.equal(branchData.custom);
    chai.expect(createdBranch.project).to.equal(projID);
    chai.expect(createdBranch.tag).to.equal(branchData.tag);

    // Verify additional properties
    chai.expect(createdBranch.createdBy).to.equal(adminUser._id);
    chai.expect(createdBranch.lastModifiedBy).to.equal(adminUser._id);
    chai.expect(createdBranch.createdOn).to.not.equal(null);
    chai.expect(createdBranch.updatedOn).to.not.equal(null);
    chai.expect(createdBranch.archived).to.equal(false);

    // Verify specific fields not returned
    chai.expect(createdBranch).to.not.have.any.keys('archivedOn', 'archivedBy',
      '__v', '_id');
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}

/**
 * @description Verifies POST /api/orgs/:orgid/projects/:projectid/branches
 * creates multiple branches.
 */
async function postBranches() {
  try {
    const branchData = [
      testData.branches[2],
      testData.branches[3],
      testData.branches[4],
      testData.branches[5],
      testData.branches[6]
    ];
    const options = {
      method: 'post',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches`,
      headers: testUtils.getHeaders(),
      data: branchData
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const createdBranches = res.data;

    // Expect foundBranches not to be empty
    chai.expect(createdBranches.length).to.equal(branchData.length);

    // Convert foundBranches to JMI type 2 for easier lookup
    const jmi2Branches = jmi.convertJMI(1, 2, createdBranches, 'id');
    // Loop through each branch data object
    branchData.forEach((branchObj) => {
      const createdBranch = jmi2Branches[branchObj.id];

      // Verify branches created properly
      chai.expect(createdBranch.id).to.equal(branchObj.id);
      chai.expect(createdBranch.name).to.equal(branchObj.name);
      chai.expect(createdBranch.custom || {}).to.deep.equal(branchObj.custom);
      chai.expect(createdBranch.project).to.equal(projID);
      chai.expect(createdBranch.tag).to.equal(branchObj.tag);

      // Verify additional properties
      chai.expect(createdBranch.createdBy).to.equal(adminUser._id);
      chai.expect(createdBranch.lastModifiedBy).to.equal(adminUser._id);
      chai.expect(createdBranch.createdOn).to.not.equal(null);
      chai.expect(createdBranch.updatedOn).to.not.equal(null);
      chai.expect(createdBranch.archived).to.equal(false);

      // Verify specific fields not returned
      chai.expect(createdBranch).to.not.have.any.keys('archivedOn', 'archivedBy',
        '__v', '_id');
    });
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}

/**
 * @description Verifies GET
 * /api/orgs/:orgid/projects/:projectid/branches/:branchid
 * finds a single branch.
 */
async function getBranch() {
  try {
    const branchData = testData.branches[0];
    const options = {
      method: 'get',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches/${branchData.id}`,
      headers: testUtils.getHeaders()
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const foundBranch = res.data[0];

    // Verify branch found properly
    chai.expect(foundBranch.id).to.equal(branchData.id);
    chai.expect(foundBranch.name).to.equal(branchData.name);
    chai.expect(foundBranch.custom || {}).to.deep.equal(branchData.custom);
    chai.expect(foundBranch.project).to.equal(projID);
    chai.expect(foundBranch.tag).to.equal(branchData.tag);

    // Verify additional properties
    chai.expect(foundBranch.createdBy).to.equal(adminUser._id);
    chai.expect(foundBranch.lastModifiedBy).to.equal(null);
    chai.expect(foundBranch.createdOn).to.not.equal(null);
    chai.expect(foundBranch.updatedOn).to.not.equal(null);
    chai.expect(foundBranch.archived).to.equal(false);

    // Verify specific fields not returned
    chai.expect(foundBranch).to.not.have.any.keys('archivedOn', 'archivedBy',
      '__v', '_id');
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}

/**
 * @description Verifies GET /api/orgs/:orgid/projects/:projectid/branches
 * finds multiple branches.
 */
async function getBranches() {
  try {
    const branchData = [
      testData.branches[1],
      testData.branches[2]
    ];
    const options = {
      method: 'get',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches`,
      headers: testUtils.getHeaders(),
      params: {
        ids: branchData.map(b => b.id).toString()
      }
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const foundBranches = res.data;

    // Expect foundBranches not to be empty
    chai.expect(foundBranches.length).to.equal(branchData.length);

    // Convert foundBranches to JMI type 2 for easier lookup
    const jmi2Branches = jmi.convertJMI(1, 2, foundBranches, 'id');
    // Loop through each branch data object
    branchData.forEach((branchObj) => {
      const foundBranch = jmi2Branches[branchObj.id];

      // Verify branches found properly
      chai.expect(foundBranch.id).to.equal(branchObj.id);
      chai.expect(foundBranch.name).to.equal(branchObj.name);
      chai.expect(foundBranch.custom || {}).to.deep.equal(branchObj.custom);
      chai.expect(foundBranch.project).to.equal(projID);
      chai.expect(foundBranch.tag).to.equal(branchObj.tag);

      // Verify additional properties
      chai.expect(foundBranch.createdBy).to.equal(adminUser._id);
      chai.expect(foundBranch.lastModifiedBy).to.equal(adminUser._id);
      chai.expect(foundBranch.createdOn).to.not.equal(null);
      chai.expect(foundBranch.updatedOn).to.not.equal(null);
      chai.expect(foundBranch.archived).to.equal(false);

      // Verify specific fields not returned
      chai.expect(foundBranch).to.not.have.any.keys('archivedOn', 'archivedBy',
        '__v', '_id');
    });
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}

/**
 * @description Verifies PATCH
 * /api/orgs/:orgid/projects/:projectid/branches/:branchid
 * updates a single branch.
 */
async function patchBranch() {
  try {
    const branchData = testData.branches[1];
    const updateObj = {
      id: branchData.id,
      name: `${branchData.name}_edit`
    };
    const options = {
      method: 'patch',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches/${branchData.id}`,
      headers: testUtils.getHeaders(),
      data: updateObj
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const updatedBranch = res.data[0];

    // Verify branch updated properly
    chai.expect(updatedBranch.id).to.equal(branchData.id);
    chai.expect(updatedBranch.name).to.equal(updateObj.name);
    chai.expect(updatedBranch.custom || {}).to.deep.equal(branchData.custom);
    chai.expect(updatedBranch.project).to.equal(projID);
    chai.expect(updatedBranch.tag).to.equal(branchData.tag);

    // Verify additional properties
    chai.expect(updatedBranch.createdBy).to.equal(adminUser._id);
    chai.expect(updatedBranch.lastModifiedBy).to.equal(adminUser._id);
    chai.expect(updatedBranch.createdOn).to.not.equal(null);
    chai.expect(updatedBranch.updatedOn).to.not.equal(null);
    chai.expect(updatedBranch.archived).to.equal(false);

    // Verify specific fields not returned
    chai.expect(updatedBranch).to.not.have.any.keys('archivedOn', 'archivedBy',
      '__v', '_id');
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}

/**
 * @description Verifies PATCH /api/orgs/:orgid/projects/:projectid/branches
 * updates multiple branches.
 *
 */
async function patchBranches() {
  try {
    const branchData = [
      testData.branches[2],
      testData.branches[3],
      testData.branches[4],
      testData.branches[5],
      testData.branches[6]
    ];
    const updateObj = branchData.map(b => ({
      id: b.id,
      name: `${b.name}_edit`
    }));
    const options = {
      method: 'patch',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches`,
      headers: testUtils.getHeaders(),
      data: updateObj
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const updatedBranches = res.data;

    // Expect updatedBranches not to be empty
    chai.expect(updatedBranches.length).to.equal(branchData.length);

    // Convert updatedBranches to JMI type 2 for easier lookup
    const jmi2Branches = jmi.convertJMI(1, 2, updatedBranches, 'id');
    // Loop through each branch data object
    branchData.forEach((branchObj) => {
      const updatedBranch = jmi2Branches[branchObj.id];

      // Verify branches created properly
      chai.expect(updatedBranch.id).to.equal(branchObj.id);
      chai.expect(updatedBranch.name).to.equal(`${branchObj.name}_edit`);
      chai.expect(updatedBranch.custom || {}).to.deep.equal(branchObj.custom);
      chai.expect(updatedBranch.project).to.equal(projID);
      chai.expect(updatedBranch.tag).to.equal(branchObj.tag);

      // Verify additional properties
      chai.expect(updatedBranch.createdBy).to.equal(adminUser._id);
      chai.expect(updatedBranch.lastModifiedBy).to.equal(adminUser._id);
      chai.expect(updatedBranch.createdOn).to.not.equal(null);
      chai.expect(updatedBranch.updatedOn).to.not.equal(null);
      chai.expect(updatedBranch.archived).to.equal(false);

      // Verify specific fields not returned
      chai.expect(updatedBranch).to.not.have.any.keys('archivedOn',
        'archivedBy', '__v', '_id');
    });
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}

/**
 * @description Verifies DELETE
 * /api/orgs/:orgid/projects/:projectid/branches/:branchid
 * deletes a single branch.
 */
async function deleteBranch() {
  try {
    const branchData = testData.branches[1];
    const options = {
      method: 'delete',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches/${branchData.id}`,
      headers: testUtils.getHeaders(),
      ca: testUtils.readCaFile()
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const deleteBranchID = res.data[0];

    // Verify correct branch deleted
    chai.expect(deleteBranchID).to.equal(branchData.id);
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}

/**
 * @description Verifies DELETE /api/orgs/:orgid/projects/:projectid/branches
 * deletes multiple branches.
 */
async function deleteBranches() {
  try {
    const branchData = [
      testData.branches[2],
      testData.branches[3],
      testData.branches[4],
      testData.branches[5],
      testData.branches[6]
    ];

    const branchIDs = branchData.map(b => b.id);
    const ids = branchIDs.join(',');
    const options = {
      method: 'delete',
      url: `${test.url}/api/orgs/${org._id}/projects/${projID}/branches?ids=${ids}`,
      headers: testUtils.getHeaders()
    };

    // Make an API request
    const res = await axios(options);

    // Expect response status: 200 OK
    chai.expect(res.status).to.equal(200);
    // Verify response body
    const deletedBranchIDs = res.data;
    chai.expect(deletedBranchIDs).to.have.members(branchIDs);
  }
  catch (error) {
    M.log.error(error);
    // Expect no error
    chai.expect(error).to.equal(null);
  }
}
