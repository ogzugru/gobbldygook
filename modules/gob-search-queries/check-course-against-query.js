import compact from 'lodash/compact'
import every from 'lodash/every'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import map from 'lodash/map'
import size from 'lodash/size'
import some from 'lodash/some'
import takeWhile from 'lodash/takeWhile'
import toPairs from 'lodash/toPairs'

const SUBSTRING_KEYS = new Set([
	'title',
	'name',
	'description',
	'notes',
	'instructors',
	'times',
	'locations',
])

function checkCourseAgainstQueryBit(course, [key, values]) {
	if (!course.hasOwnProperty(key)) {
		return false
	}

	let substring = SUBSTRING_KEYS.has(key)

	// values is either:
	// - a 1-long array
	// - an $AND, $OR, $NOT, $NOR, or $XOR query
	// - one of the above, but substring

	let hasBool = typeof values[0] === 'string' && values[0].startsWith('$')
	let OR = values[0] === '$OR'
	let NOR = values[0] === '$NOR'
	let AND = values[0] === '$AND'
	let NOT = values[0] === '$NOT'
	let XOR = values[0] === '$XOR'

	if (hasBool) {
		// remove the first value from the array
		// by returning all but the first element
		values = values.slice(1)
	}

	let internalMatches = map(values, val => {
		// dept, gereqs, etc.
		if (isArray(course[key]) && !substring) {
			return includes(course[key], val)
		} else if (isArray(course[key]) && substring) {
			return some(
				map(course[key], item =>
					includes(item.toLowerCase(), val.toLowerCase()),
				),
			)
		} else if (substring) {
			return includes(course[key].toLowerCase(), val.toLowerCase())
		}
		return course[key] === val
	})

	if (!hasBool) {
		return every(internalMatches)
	}

	let result = false

	if (OR) result = some(internalMatches)
	if (NOR) result = !some(internalMatches)
	if (AND) result = every(internalMatches)
	if (NOT) result = !every(internalMatches)
	if (XOR) result = compact(internalMatches).length === 1

	return result
}

// Checks if a course passes a query check.
// query: Object | the query object that comes out of buildQueryFromString
// course: Course | the course to check
// returns: Boolean | did all query bits pass the check?
export function checkCourseAgainstQuery(query, course) {
	let kvPairs = toPairs(query)
	let matches = takeWhile(kvPairs, pair =>
		checkCourseAgainstQueryBit(course, pair),
	)

	return size(kvPairs) === size(matches) && every(matches)
}
