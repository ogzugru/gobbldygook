var _ = require('lodash')
var React = require('react')

var CourseList = require('./courseList')
var Course = require('./course')

var makeCourseObjects = require('../helpers/makeCourseObjects')

var Semester = React.createClass({
	render: function() {
		console.log('semester render')

		var semesterName = 'Unknown (' + this.props.name + ')';

		if (this.props.name === '1') {
			semesterName = 'Fall';
		} else if (this.props.name === '2') {
			semesterName = 'Interim';
		} else if (this.props.name === '3') {
			semesterName = 'Spring';
		} else if (this.props.name === '4') {
			semesterName = 'Early Summer';
		} else if (this.props.name === '5') {
			semesterName = 'Late Summer';
		}

		var activeSchedules = _.filter(this.props.schedules, 'active')
		var clbids = _.pluck(activeSchedules, 'clbids')
		var courseObjects = makeCourseObjects(_.uniq(_.flatten(this.props.clbids)))

		return React.DOM.div( {className:"semester"},
			React.DOM.header({className: "semester-title"},
				React.DOM.h1(null, semesterName)),
			CourseList( {courses: courseObjects} )
		)
	}
})

module.exports = Semester
