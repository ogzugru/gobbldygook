#!/usr/bin/env node
/* eslint-disable no-global-assign */

require = require('esm')(module /*, options*/)

require('flow-remove-types/register')({excludes: null})

require('./module.js').default()
