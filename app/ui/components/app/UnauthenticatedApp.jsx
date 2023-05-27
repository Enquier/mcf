/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.app.UnauthenticatedApp
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description This renders the unauthenticated version of the app. Essentially all it does is
 * redirect to the login page if the user is not already there.
 */

/* Modified ESLint rules for React. */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/require-jsdoc */

// React modules
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// MBEE modules
import LoginPage from './LoginPage.jsx';

export default function UnauthenticatedApp(props) {
  return (
    <React.Fragment>
      <Routes>
        <Route path={'/login'} element={<LoginPage />}/>
        <Route path={'/'} render={() => <Navigate to={'/login'}/>}/>
      </Routes>
    </React.Fragment>
  );
}
