var _ = require('lodash')
var React = require('react')

var AreaOfStudy = require('./areaOfStudy')
var StudentSummary = require('./studentSummary')

var getCourses = require('../helpers/getCourses').getCourses

var GraduationStatus = React.createClass({
	putActiveCoursesIntoState: function() {
		var clbids = _.chain(this.props.schedules.val())
			.filter('active')
			.pluck('clbids')
			.flatten()
			.uniq()
			.value()

		var self = this
		getCourses(clbids).then(function(courses) {
			console.log('retrieved ' + courses.length + ' courses for graduation-status')
			self.setState({
				courses: courses
			})
		})
	},
	getInitialState: function() {
		return {
			courses: []
		}
	},
	componentWillReceiveProps: function() {
		this.putActiveCoursesIntoState()
	},
	componentDidMount: function() {
		this.putActiveCoursesIntoState()
	},
	render: function() {
		console.log('graduation-status render')

		// Get areas of study
		var areasOfStudy = _.groupBy(this.props.studies.val(), 'type')
		areasOfStudy = _.mapValues(areasOfStudy, function(areas) {
			return _.map(areas, function(area) {
				area.key = area.id
				area.courses = this.state.courses
				return AreaOfStudy(area)
			}, this)
		}, this)

		return React.DOM.section( {className:"graduation-status"},
			StudentSummary( _.merge(this.props, {courses: this.state.courses}) ),
			React.DOM.section( {id:"degrees"},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, "Degrees"),
					React.DOM.button({className: "add-area-of-study", title: "Add Degree"})
				),
				areasOfStudy.degree
			),
			React.DOM.section( {id:"majors"},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, "Majors"),
					React.DOM.button({className: "add-area-of-study", title: "Add Major"})
				),
				areasOfStudy.major
			),
			React.DOM.section( {id:"concentrations"},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, "Concentrations"),
					React.DOM.button({className: "add-area-of-study", title: "Add Concentration"})
				),
				areasOfStudy.concentration
			)
		)
	}
});

module.exports = GraduationStatus
