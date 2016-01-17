import React, { Component, PropTypes, cloneElement } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import omit from 'lodash/object/omit'

import Sidebar from './sidebar'
import Loading from '../components/loading'
import getStudentCourses from '../helpers/get-student-courses'
import ShareSheet from './share-sheet'

import './student.scss'

export class Student extends Component {
	static propTypes = {
		actions: PropTypes.object,
		areas: PropTypes.array,
		canRedo: PropTypes.bool,
		canUndo: PropTypes.bool,
		children: PropTypes.node.isRequired,  // from react-router
		params: PropTypes.object,
		student: PropTypes.object,
	};

	static contextTypes = {
		location: PropTypes.object.isRequired,
	};

	constructor() {
		super()
		this.state = {
			courses: [],
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.student) {
			getStudentCourses(nextProps.student).then(courses => {
				this.setState({
					courses: courses,
				})
				return null
			})
		}
	}

	render() {
		if (!this.props.student) {
			return <Loading>{`Loading Student ${this.props.params.id}`}</Loading>
		}

		const childProps = omit(this.props, 'children')

		return (
			<DocumentTitle title={`${this.props.student.name} | Gobbldygook`}>
				<div className='student'>
					<Sidebar {...childProps} courses={this.state.courses} areas={this.props.areas} />
					{cloneElement(this.props.children, {...childProps, courses: this.state.courses, className: 'content'})}
					{'share' in this.context.location.query && <ShareSheet student={this.props.student} />}
				</div>
			</DocumentTitle>
		)
	}
}


const mapStateToProps = (state, ownProps) => ({
	student: state.students.present[ownProps.params.id],
})

export default connect(mapStateToProps)(Student)