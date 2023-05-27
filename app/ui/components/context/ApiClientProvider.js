/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.mms-api-client.ApiClientProvider
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description Defines the api client class.
 */

/* Modified ESLint rules for React. */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/require-jsdoc */

// Other modules
import axios from 'axios';

// React modules
import React, { createContext, useContext } from 'react';

// MBEE modules
import AuthService from '../../api/mms-api-client/AuthService';
import UserService from '../../api/mms-api-client/UserService';
import OrgService from '../../api/mms-api-client/OrgService';
import ProjectService from '../../api/mms-api-client/ProjectService';
import BranchService from '../../api/mms-api-client/BranchService';
import ArtifactService from '../../api/mms-api-client/ArtifactService';
import ElementService from '../../api/mms-api-client/ElementService';
import { useAuth } from './AuthProvider';
import HttpProvider from './HttpProvider';

const apiClientContext = createContext();

export function ApiClientProvider(props) {
  const authContext = useAuth();
  const httpContext = new HttpProvider();
  const authService = new AuthService(authContext, httpContext);
  const userService = new UserService(authContext, httpContext);
  const orgService = new OrgService(authContext, httpContext);
  const projectService = new ProjectService(authContext, httpContext);
  const branchService = new BranchService(authContext, httpContext);
  const artifactService = new ArtifactService(authContext, httpContext);
  const elementService = new ElementService(authContext, httpContext);

  const value = {
    authService,
    userService,
    orgService,
    projectService,
    branchService,
    artifactService,
    elementService,
  };
  return <apiClientContext.Provider value={value} {...props}/>;
}

export function useApiClient() {
  const context = useContext(apiClientContext);
  if (!context) throw new Error('');
  return context;
}
