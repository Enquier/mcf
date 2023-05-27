import $ from 'jquery';
import axios from 'axios';

const uiConfig = require('../../../build/json/uiConfig.json');

const formatter = require(`../api/${(uiConfig.apiServer) ? uiConfig.apiServer.type : 'mcf'}-api-client/lib/formatter.js`);
/**
 * @classification UNCLASSIFIED
 *
 * @module ui.js.mbee
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner James Eckstein
 *
 * @author Leah De Laurell
 * @author James Eckstein
 * @author Josh Kaplan
 *
 * @description Contains necessary functions for the MBEE UI.
 */
/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable jsdoc/require-jsdoc */

$.fn.extend({
  autoResize() {
    const nlines = $(this).html().split('\n').length;
    $(this).attr('rows', nlines + 1);
  },
});

/**
 * @description Given an API parameter string, converts to Proper Case. Conversely, given a Proper
 * Case string will convert to an API parameter string.
 * e.g. createdBy <-> Created By, lastModifiedBy <-> Last Modified By
 *
 * @param {string} param - API parameter string.
 * @param {string} caseType - Case to convert to e.g 'Proper Case' vs 'API Parameter Format'.
 *
 * @returns {string} - Converted case string.
 */
// eslint-disable-next-line no-unused-vars
function convertCase(param, caseType) {
  // Check if param is not a string
  if (typeof param !== 'string' || typeof caseType !== 'string') {
    // Cannot convert case, return param
    return param;
  }

  let convertedCase = '';

  if (caseType === 'proper') {
    // Convert API params to option values
    convertedCase = param.split(/(?=[A-Z])/).join(' ');
    convertedCase = convertedCase.charAt(0).toUpperCase() + convertedCase.slice(1);
  } else if (caseType === 'api') {
    // Remove spaces fom string
    convertedCase = param.split(' ').join('');
    // Convert first character to lower case
    convertedCase = convertedCase.charAt(0).toLowerCase() + convertedCase.slice(1);
  }

  return convertedCase;
}

/**
 * @description Decodes an HTML encoded string.
 *
 * @param {string} encodedString - HTML encoded string.
 *
 * @returns {string} - Decoded string.
 */
// eslint-disable-next-line no-unused-vars
export const decodeHTML = (encodedString) => {
  // Check if input is string type
  if (typeof encodedString === 'string') {
    // Replace HTML escape sequences with corresponding characters
    return String(encodedString)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }
};
