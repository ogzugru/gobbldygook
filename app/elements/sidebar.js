import React from 'react'
import {Link, State} from 'react-router'

import RevertToDemoButton from 'app/components/revertToDemoButton'
import DownloadStudentButton from 'app/components/downloadStudentButton'
import UndoButton from 'app/components/undoButton'
import RedoButton from 'app/components/redoButton'

import SearchButton from 'app/elements/searchButton'
import GraduationStatus from 'app/elements/graduationStatus'

let Sidebar = React.createClass({
	mixins: [State],

	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	toggleSearch() {
		this.setState({isSearching: !this.state.isSearching})
	},

	getInitialState() {
		return {
			isSearching: false,
		}
	},

	render() {
		let student = this.props.student

		let component = GraduationStatus
		let props = {student}
		if (this.state.isSearching) {
			component = SearchButton
			props.toggle = this.toggleSearch
		}

		let sidebar = React.createElement(component, props)

		let studentButtons = React.createElement('menu', {className: 'button-list student-buttons'},
			React.createElement('button',
				{className: 'back'},
				React.createElement(Link, {to: '/'}, 'All Students')),
			React.createElement('button',
				{className: 'search', onClick: this.toggleSearch},
				'Search'),
			React.createElement(DownloadStudentButton, {student}),
			React.createElement(RevertToDemoButton, {studentId: student.id}),
			React.createElement(UndoButton, null),
			React.createElement(RedoButton, null))

		return React.createElement('aside', {className: 'sidebar'}, studentButtons, sidebar)
	},
})

export default Sidebar
