import _ from 'lodash'
import React from 'react/addons'
import humanize from 'humanize-plus'
import {DragDropMixin} from 'react-dnd'

import studentActions from '../flux/studentActions'
import itemTypes from '../models/itemTypes'
import semesterName from 'sto-helpers/lib/semesterName'

let cx = React.addons.classSet

function findSemesterList() {
	return [
		{id: 1, title: 'Fall 2012-13'},
		{id: 2, title: 'Interim 2012-13'},
		{id: 3, title: 'Spring 2012-13'},
	]
}


let CourseTitle = React.createClass({
	render() {
		let course = this.props.info

		let titleText = course.title
		let type = this.props.info.type
		let courseName = course.name || course.title

		if (course.type === 'Topic')
			titleText = courseName.replace(/top.*: */gi, '')

		let isIndependent = /^I[RS]/.test(courseName)
		if (isIndependent) {
			type = courseName.substr(0, 3)
			if (courseName.length > 3)
				titleText = courseName.substring(3)
		}

		let courseType = React.createElement('span', {className: 'type'}, type)
		let title = React.createElement('h1',
			{className: 'title'},
			(this.props.info.type === 'Research' && !isIndependent) ? null : courseType,
			titleText)

		return title
	}
})


let ExpandedCourse = React.createClass({
	propTypes: {
		info: React.PropTypes.object,
		student: React.PropTypes.object,
		schedule: React.PropTypes.object,
	},

	removeFromSemester() {
		studentActions.removeCourse(this.props.student.id, this.props.schedule.id, this.props.info.clbid)
	},

	render() {
		let course = this.props.info
		let tools = []

		// /////

		let title = React.createElement(CourseTitle, this.props)

		let identifier = React.createElement('span',
			{className: 'identifier'},
			course.dept, ' ', course.num, course.sect)

		let professors = React.createElement('span',
			{className: 'professors'},
			humanize.oxford(course.profs))

		let summary = React.createElement('p',
			{className: 'summary'},
			identifier, professors)

		// /////

		let offerings = React.createElement('p',
			{className: 'offerings'},
			_.map(course.times,
				time => React.createElement('span', {key: time}, time)))

		let gereqs = React.createElement('ul',
			{className: 'gereqs'},
			_.map(course.gereqs,
				ge => React.createElement('li', {key: ge}, ge)))

		let description = React.createElement('p',
			{className: 'description'},
			course.desc)

		let credits = React.createElement('span',
			{className: 'credits'},
			course.credits + ' ' + humanize.pluralize(course.credits, 'credit'))

		let classInstanceOffered = React.createElement('span',
			{className: 'instance'},
			semesterName(course.sem) + ' ' + course.year)

		let info = React.createElement('p',
			{className: 'info'},
			credits, classInstanceOffered)

		let details = React.createElement('div',
			{className: 'details'},
			offerings, gereqs, description, info)

		// /////

		let semesterList = React.createElement('select',
			{className: 'semester-select', key: 'semester-select'},
			_.map(findSemesterList(), (s =>
				React.createElement('option', {value: s.id, key: s.id}, s.title))))
		tools.push(semesterList)

		let deleteButton = React.createElement('button', {className: 'remove-course', onClick: this.removeFromSemester, key: 'remove-course'}, 'Remove Course')
		if (this.props.schedule) {
			tools.push(deleteButton)
		}

		let toolsEls = React.createElement('div',
			{className: 'tools', onClick: (ev) => {ev.stopPropagation()}},
			tools)

		// /////

		return React.createElement('div', {className: 'info-rows'}, title, summary, details, toolsEls)
	},
})


let CollapsedCourse = React.createClass({
	render() {
		let course = this.props.info

		let title = React.createElement(CourseTitle, this.props)

		let identifier = React.createElement('span',
			{className: 'identifier'},
			course.dept, ' ', course.num, course.sect)

		let professors = React.createElement('span',
			{className: 'professors'},
			humanize.oxford(course.profs))

		let summary = React.createElement('p',
			{className: 'summary'},
			identifier, professors)

		return React.createElement('div', {className: 'info-rows'}, title, summary)
	}
})

let Course = React.createClass({
	mixins: [DragDropMixin],

	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dragSource: {
				beginDrag() {
					return {
						item: {clbid: this.props.info.clbid}
					}
				},
				endDrag(didDrop) {
					if (didDrop) {
						if (this.props.student) {
							studentActions.removeCourse(this.props.student.id, this.props.schedule.id, this.props.info.clbid)
						}
					}
				},
			}
		})
	},

	getInitialState() {
		return {
			isOpen: false
		}
	},

	toggle() {
		// console.log(this.state.isOpen ? 'collapse' : 'expand')
		this.setState({
			isOpen: !this.state.isOpen
		})
	},

	findWarnings() {
		let thisYear = new Date().getFullYear()
		let warnings = []

		if (this.props.schedule && (this.props.info.year !== this.props.schedule.year) && this.props.schedule.year <= thisYear) {
			warnings.push({
				msg: `This course (from ${this.props.info.year}) is not offered in this year (${this.props.schedule.year}).`
			})
		}

		if (this.props.schedule && this.props.info.sem !== this.props.schedule.semester) {
			warnings.push({
				msg: `This course (from ${semesterName(this.props.info.sem)}) is not offered in this semester.`,
				className: 'course-invalid-semester',
			})
		}

		if (this.props.conflicts && !_.isUndefined(this.props.index)) {
			let i = this.props.index
			if (_.any(this.props.conflicts[i])) {
				let conflictIndex = _.findIndex(this.props.conflicts[i], item => item === true)
				conflictIndex = conflictIndex + 1 // because humans don't 0-index lists
				warnings.push({
					msg: `This course has a time conflict with the ${humanize.ordinal(conflictIndex)} course.`,
					className: 'course-time-conflict',
				})
			}
		}

		let warningEls = _.map(warnings, (w, index) => {
			let className = w.className || 'course-alert'
			return React.createElement('span', {className, title: w.msg, key: className + index})
		})

		return React.createElement('div',
			{className: 'warnings'},
			warningEls)
	},

	render() {
		let course = this.props.info

		let isDragging = this.getDragState(itemTypes.COURSE).isDragging

		let courseInfo = this.state.isOpen ?
			React.createElement(ExpandedCourse, this.props) :
			React.createElement(CollapsedCourse, this.props)

		let warnings = this.findWarnings()

		return React.createElement('article',
			_.extend(
				{
					className: cx({
						course: true,
						expanded: this.state.isOpen,
						'is-dragging': isDragging,
					}),
					onClick: this.toggle,
				},
				this.dragSourceFor(itemTypes.COURSE)),

			courseInfo, warnings
		)
	},
})

let EmptyCourseSlot = React.createClass({
	render() {
		let title = 'Empty Slot'

		let titleEl = React.createElement('h1', {className: 'title'}, title)
		let details = React.createElement('p', {className: 'summary'}, 'no details')

		return React.createElement('article', {className: 'course empty'},
			React.createElement('div', {className: 'info-rows'}, titleEl, details))
	}
})

let MissingCourse = React.createClass({
	render() {
		let title = `Missing Course`

		let titleEl = React.createElement('h1', {className: 'title'}, title)
		let details = React.createElement('p', {className: 'summary'}, 'no details')

		return React.createElement('article', {className: 'course missing'},
			React.createElement('div', {className: 'info-rows'}, titleEl, details))
	}
})

export default Course
export {Course, MissingCourse, EmptyCourseSlot}
