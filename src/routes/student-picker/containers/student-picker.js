import React, {Component, PropTypes} from 'react'
import StudentPicker from '../components/student-picker'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { destroyStudent, loadStudents } from '../../../redux/students/actions'

export default class StudentPickerContainer extends Component {
	static propTypes = {
		destroyStudent: PropTypes.func.isRequired,
		loadStudents: PropTypes.func.isRequired,
		routing: PropTypes.object.isRequired,
		students: PropTypes.object.isRequired,
	};

	// since we are starting off without any data, there is no initial value
	state = {
		filterText: '',
		isEditing: false,
		sortBy: 'dateLastModified',
		groupBy: 'nothing',
	};

	componentWillMount() {
		this.props.loadStudents()
	}

	onFilterChange = ev => {
		this.setState({filterText: ev.target.value.toLowerCase()})
	};

	onGroupChange = () => {};

	onSortChange = () => {
		this.setState({sortBy: this.state.sortBy === 'dateLastModified' ? 'name' : 'dateLastModified'})
	};

	onToggleEditing = () => {
		this.setState({isEditing: !this.state.isEditing})
	};

	render() {
		return (
			<StudentPicker
				{...this.props}
				filterText={this.state.filterText}
				groupBy={this.state.groupBy}
				isEditing={this.state.isEditing}
				onAddStudent={this.onAddStudent}
				onFilterChange={this.onFilterChange}
				onGroupChange={this.onGroupChange}
				onOpenSearchOverlay={this.onOpenSearchOverlay}
				onSortChange={this.onSortChange}
				onToggleEditing={this.onToggleEditing}
				sortBy={this.state.sortBy}
			/>
		)
	}
}


const mapStateToProps = state => ({
	students: state.students.present,
	routing: state.routing,
})

const mapDispatchToProps = dispatch => ({
	...bindActionCreators({destroyStudent, loadStudents}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentPickerContainer)