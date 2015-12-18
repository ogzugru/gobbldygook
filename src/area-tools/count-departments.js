import compact from 'lodash/array/compact'
import getDepartments from './get-departments'

/**
 * Counts the number of unique departments in a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique departments
 */
export default function countDepartments(courses) {
	return compact(getDepartments(courses)).length
}