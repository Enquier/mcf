/**
 * @classification UNCLASSIFIED
 *
 * @module mms-client.utils
 *
 * @copyright Copyright (C) 2022, JPL/Caltech
 *
 * @license Apache-2.0
 *
 * @owner Charles Galey
 *
 * @author Charles Galey
 *
 * @description Defines miscellaneous helper functions.
 */

const ID_DELIMITER = ':';
module.exports.ID_DELIMITER = ID_DELIMITER;

/**
 * @description Splits a UID on the UID delimiter up and returns an array of UID components.
 *
 * @param {string} uid - The uid.
 *
 * @returns {string[]} Split uid.
 */
module.exports.parseID = function (uid) {
  return uid.split(ID_DELIMITER);
};
