/**
 * @classification UNCLASSIFIED
 *
 * @module ui.components.Index
 *
 * @copyright Copyright (C) 2018, Lockheed Martin Corporation
 *
 * @license Apache-2.0
 *
 * @owner Connor Doyle
 *
 * @author Connor Doyle
 *
 * @description This is the entrypoint for the app.  It wraps the app in several provider
 * components that make data easily available to all children components without the need
 * for passing variables through props.
 */

/* Modified ESLint rules for React. */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */

// CSS Import
import '../sass/styles.scss';

// Resource Files
import '../img/logo.svg';
import '../img/mbee-concept.png';

// Other Dependent Resources

import 'bootstrap';
import 'jquery';
import 'jquery-ui-dist/jquery-ui';
import 'popper.js';

// React modules
import React from 'react';
import { createRoot } from 'react-dom/client';

// MBEE modules
import App from './app/App.jsx';
import { AuthProvider } from './context/AuthProvider';
import { ApiClientProvider } from './context/ApiClientProvider';

const container = document.getElementById('main');

const root = createRoot(container);

root.render(<AuthProvider>
  <ApiClientProvider>
    <App/>
  </ApiClientProvider>
</AuthProvider>)
