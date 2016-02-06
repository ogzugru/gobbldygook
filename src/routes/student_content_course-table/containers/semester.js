import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import filter from 'lodash/filter'
import map from 'lodash/map'
import isCurrentSemester from '../../../helpers/is-current-semester'

import Loading from '../../../components/loading'
import {destroySchedules} from '../../../redux/students/actions/schedules'
import {moveCourse, addCourse} from '../../../redux/students/actions/courses'
import Semester from '../components/semester'

import getSchedule from '../../../helpers/get-schedule'


export class SemesterContainer extends Component {
	static propTypes = {
		addCourse: PropTypes.func.isRequired,  // redux
		destroySchedules: PropTypes.func.isRequired, // redux
		moveCourse: PropTypes.func.isRequired, // redux
		semester: PropTypes.number.isRequired,
		student: PropTypes.object.isRequired,
		year: PropTypes.number.isRequired,
	};

	removeSemester = () => {
		const { student, semester, year } = this.props
		const thisSemesterSchedules = filter(student.schedules, isCurrentSemester(year, semester))
		const scheduleIds = map(thisSemesterSchedules, s => s.id)
		this.props.destroySchedules(student.id, ...scheduleIds)
	};

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.student !== this.props.student ||
			nextProps.addCourse !== this.props.addCourse ||
			nextProps.moveCourse !== this.props.moveCourse ||
			nextProps.destroySchedules !== this.props.destroySchedules
		)
	}

	render() {
		const { student, semester, year, addCourse, moveCourse } = this.props
		const schedule = getSchedule(student, year, semester)

		if (schedule.isValidating) {
			return <Loading>Loading Courses…</Loading>
		}

		return (
			<Semester
				addCourse={addCourse}
				moveCourse={moveCourse}
				removeSemester={this.removeSemester}
				schedule={schedule}
				semester={semester}
				studentId={student.id}
				year={year}
			/>
		)
	}
}


const mapDispatchToProps = dispatch =>
	bindActionCreators({destroySchedules, moveCourse, addCourse}, dispatch)

const connected = connect(undefined, mapDispatchToProps)(SemesterContainer)


export default connected
