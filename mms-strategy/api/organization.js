import { DynamicError, ServerError } from '../../../lib/errors';

import { OrgsApi } from '../api/mms-api-client';

const formatter = require('../lib/formatter');

const expectedFunctions = ['bulkWrite', 'countDocuments', 'deleteIndex',
  'deleteMany', 'find', 'findOne', 'getIndexes', 'insertMany', 'updateMany',
  'updateOne'];

class OrganizationHelper {
  constructor(apiClient) {
    this.orgs = new OrgsApi(apiClient);
  }

  async bulkWrite(ops, options, req) {
    const promises = [];
    let modifiedCount = 0;
    const body = {};
    body.orgs = [];
    const configuration = new Configuration({ accessToken: req.session.token });
    ops.forEach((op, indx) => {
      if (Object.keys(op)[0] === 'updateOne') {
        // Grab the filter and update object
        const { filter } = Object.values(op)[0];
        const { update } = Object.values(op)[0];
        body.orgs.push(formatter.apiOrg(req.user, update, filter._id));
      } else if (Object.keys(op)[0] === 'replaceOne') {
        const { replacement } = Object.values(op)[0];
        body.orgs.push(formatter.apiOrg(req.user, replacement));
      } else if (Object.keys(op)[0] === 'deleteOne') {
        const { filter } = Object.values(op)[0];
        promises.push(OrgsApiFp(configuration).deleteOrg(filter._id).then(() => {
          modifiedCount += 1;
        }));
      }
    });

    if (body.orgs.length > 0) {
      promises.push(OrgsApiFp(configuration).createOrUpdateOrgs(body));
    }

    await Promise.all(promises).then((responses) => {
      responses.forEach((response) => {
        if (response.data.rejected.length > 0) {
          response.data.rejected.forEach(((rej) => {
            throw new DynamicError(rej.message, 'warn', rej.code);
          }));
        }
        modifiedCount = response.data.orgs.length;
      });
    }).catch((e) => {
      throw new DynamicError(e.response.message, 'error', e.response.status);
    });

    return { modifiedCount, result: 1 };
  }

  async deleteMany(filter, options = null, req) {
    const promises = [];
    let modifiedCount = 0;
    const configuration = new Configuration({ accessToken: req.session.token });
    const orgs = await OrgsApiFp(configuration).getAllOrgs();
    for (const key in filter) {
      const array = filter[key].id;
      orgs.data.orgs.filter((org) => (org[key] in array)).forEach((result) => {
        promises.push(OrgsApiFp(configuration).deleteOrg(result._id).then(() => {
          modifiedCount += 1;
        }));
      });
    }

    await Promise.all(promises).then((responses) => {
      responses.forEach((response) => {
        if (response.data.rejected.length > 0) {
          response.data.rejected.forEach(((rej) => {
            throw new DynamicError(rej.message, 'warn', rej.code);
          }));
        }
        modifiedCount = response.data.orgs.length;
      });
    }).catch((e) => {
      throw new DynamicError(e.response.message, 'error', e.response.status);
    });

    return { modifiedCount, result: 1 };
  }

  async find(filter, projection, options, req) {
    if (M.config.db.auth && M.config.db.auth === true) {
      return super.find(filter, projection, options, req);
    }
    return super.find(filter, projection, options);
  }

  async findOne(filter, projection, options, req) {
    if (M.config.db.auth && M.config.db.auth === true) {
      return super.findOne(filter, projection, options, req);
    }
    return super.findOne(filter, projection, options);
  }

  async getIndexes() {
    return super.getIndexes();
  }

  async insertMany(docs, options, req) {
    if (M.config.db.auth && M.config.db.auth === true) {
      return super.insertMany(docs, options, req);
    }
    return super.insertMany(docs, options);
  }

  async updateMany(filter, doc, options, req) {
    if (M.config.db.auth && M.config.db.auth === true) {
      return super.updateMany(filter, doc, options, req);
    }
    return super.updateMany(filter, doc, options);
  }

  async updateOne(filter, doc, options, req) {
    if (M.config.db.auth && M.config.db.auth === true) {
      return super.updateOne(filter, doc, options, req);
    }
    return super.updateOne(filter, doc, options);
  }
}

module.exports(Organization);
