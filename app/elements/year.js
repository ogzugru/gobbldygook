import * as React from 'react'
import * as Immutable from 'immutable'

import Course from 'elements/course'
import Semester from 'elements/semester'

import studentActions from 'flux/studentActions'
import {expandYear} from 'helpers/semesterName'
import findFirstAvailableSemester from 'helpers/findFirstAvailableSemester'
import calculateNextScheduleId from 'helpers/calculateNextScheduleId'

var Year = React.createClass({
	canAddSemester() {
		return findFirstAvailableSemester(this.props.student.schedules, this.props.year) <= 5
	},

	addSemester() {
		var nextAvailableSemester = findFirstAvailableSemester(this.props.student.schedules, this.props.year)

		studentActions.addSchedule(this.props.student.id, {
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	},

	removeYear() {
		var currentYearSchedules = this.props.student.schedules.filter((s) => s.year === this.props.year)
		var scheduleIds = currentYearSchedules.map(s => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},

	getInitialState() {
		return {
			schedules: Immutable.List()
		}
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		let thisYearSchedules = nextProps.student.schedulesByYear.get(nextProps.year)
		let schedules = thisYearSchedules.filter(s => s.active)
		this.setState({schedules})
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return nextState.schedules !== this.state.schedules
	},

	render() {
		let terms = this.state.schedules
			.sortBy(schedule => schedule.semester)
			.map((schedule) =>
				React.createElement(Semester, {
					key: schedule.semester,
					student: this.props.student,
					semester: schedule.semester,
					year: this.props.year,
				}))
			.toList()

		return React.createElement('div', {className: 'year'},
			React.createElement('header', {className: 'year-title'},
				React.createElement('h1', null, expandYear(this.props.year)),
				React.createElement('button', {
					className: 'remove-year',
					title: `Remove the year ${this.props.year}`,
					onClick: this.removeYear,
				})
			),
			React.createElement('div',
				{className: 'semester-list'},
				terms.toJS()
			),
			React.createElement('button', {
				className: 'add-semester',
				title: 'Add Semester',
				disabled: !this.canAddSemester(),
				onClick: this.addSemester,
			})
		)
	},
})

export default Year
