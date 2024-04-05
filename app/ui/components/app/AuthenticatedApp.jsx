/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.app.AuthenticatedApp
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description This renders the authenticated app. It acts as a switchboard for every
 * page in the app.
 */

/* Modified ESLint rules for React. */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/require-jsdoc */

// React modules
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// MBEE modules
import Home from '../home-views/home.jsx';
import OrgHome from '../org-views/org-home.jsx';
import ProjectHome from '../project-views/project-home.jsx';
import ProfileHome from '../profile-views/profile-home.jsx';
import AdminConsoleHome from '../admin-console-views/admin-console-home.jsx';
import About from '../general/About.jsx';
import NotFound from '../shared-views/NotFound.jsx';
import { Nav } from 'reactstrap';

import uiConfig from '../../../../build/json/uiConfig.json';

export default function AuthenticatedApp(props) {
  const basePath = () => {
    let path = '/'
    if (typeof uiConfig.basePath !== 'undefined') {
      path = uiConfig.basePath.replace(/\/$/, "");
    }
    return path;
  };
  return (
    <Routes>
      <Route path={'/login'} element={<Navigate to='/' replace />}/>
      <Route path={'/orgs/:orgid/projects/:projectid'} element={<ProjectHome />} />
      <Route path={'/orgs/:orgid'} element={<OrgHome />} />
      <Route path={'/profile/:username'} element={<ProfileHome />}/>
      <Route path={'/profile'} element={<ProfileHome />}/>
      <Route path={'/admin'} element={<AdminConsoleHome />}/>
      <Route path={'/about'} element={<About />}/>
      <Route path={'/'} exact element={<Home />}/>
      <Route path={'/'} element={<NotFound />}/>
    </Routes>
  );
}
