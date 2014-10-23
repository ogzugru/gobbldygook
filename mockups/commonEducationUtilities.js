'use strict';

import * as _ from 'lodash'

function onlyQuarterCreditCoursesCanBePassFail(course) {
	// NOTE: Because we can't check this (don't know p/f data), we return true
	// for everything.
	return true
}

var hasGenEd = _.curry(function(gened, course) {
	return _.contains(course.gereqs, gened)
})

var hasFOL = function(course) {
	return _.any(course.gereqs,
		req => req.substr(0,3) === 'FOL')
}

function countGeneds(courses, gened) {
	if (gened === 'FOL')
		return _.size(_.filter(courses, hasFOL))
	return _.size(_.filter(courses, hasGenEd(gened)))
}

function getDepartments(courses) {
	return _.chain(courses).pluck('depts').flatten().uniq().value()
}

function acrossAtLeastTwoDepartments(courses) {
	var depts = getDepartments(courses)

	return _.size(depts) >= 2
}

function checkThatNCoursesSpanTwoDepartments(courses, geneds, genedToCheck, n=2) {
	// Input: courses-array of courses. geneds-['ALS-A', 'ALS-L']. genedToCheck-'ALS-A'
	// XXX,YYY - N courses, from different departments
	var coursesOne = _.filter(courses, hasGenEd(geneds[0]))
	var coursesTwo = _.filter(courses, hasGenEd(geneds[1]))

	var allCourses = _.uniq(_.merge(coursesOne, coursesTwo), 'crsid')
	var coversTwoDepartments = acrossAtLeastTwoDepartments(allCourses)

	return _.all([
		countGeneds(courses, genedToCheck) >= 1,
		_.size(allCourses) >= n,
		coversTwoDepartments
	])
}

export {
	onlyQuarterCreditCoursesCanBePassFail,
	hasGenEd,
	hasFOL,
	countGeneds,
	getDepartments,
	acrossAtLeastTwoDepartments,
	checkThatNCoursesSpanTwoDepartments
}
