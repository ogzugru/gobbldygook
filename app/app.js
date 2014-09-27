'use strict';

var _ = require('lodash')
var Promise = require('bluebird')
var db = require('./helpers/db')
var React = require('react')
var Fluxxor = require('fluxxor')
var documentReady = require('./helpers/document-ready')

var Gobbldygook = require('./models/gobbldygookApp')
var loadData = require('./helpers/loadData')
var demoStudent = require('../mockups/demo_student.json')

var actions = require('./actions/StudentActions')
var StudentStore = require('./stores/StudentStore')

// Just for use in the browser console, I swear.
window.lodash = _

// Create the deptnum/crsid cache.
window.deptNumToCrsid = {}

// Stick React where I (and the Chrome devtools) can see it.
window.React = React

window.log = function(thing){console.log(thing)}

// Initialize some library options.
Promise.longStackTraces()
React.initializeTouchEvents(true)

module.exports = {
	flux: function() {
		return db.store('students').all()
			.then(function(results) {
				var students = [demoStudent]

				if (results.length > 0) {
					console.log('results!', results)
					students = results
				} else {
					console.log('no results!', demoStudent)
				}

				var stores = {StudentStore: new StudentStore({students: students})}
				var flux = new Fluxxor.Flux(stores, actions)

				// window.flux = flux
			})
	},
	blastoff: function() {
		// Wait for document.ready and the database.
		Promise.all([db, document.ready]).bind(this).then(function() {
			console.log('3. 2.. 1... Blastoff!')

			// Load data into the database
			loadData()

			// Set up Fluxxor
			return this.flux()
		}).then(function() {
			// Render the app
			var studentComponent = React.renderComponent(
				Gobbldygook({flux: window.flux}),
				document.body)
		}).done()
	},
}

// run it
module.exports.blastoff()
