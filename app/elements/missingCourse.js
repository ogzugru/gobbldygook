import React from 'react'
import FakeCourse from '../components/fakeCourse'

let MissingCourse = React.createClass({
	render() {
		return React.createElement(FakeCourse, {title: 'Missing Slot', className: 'missing'})
	}
})

export default MissingCourse
