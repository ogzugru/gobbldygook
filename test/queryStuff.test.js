// tests/queryStuff-test.js
import 'should'

describe('buildQueryFromString', () => {
	it('interprets a query string into a query object', () => {
		import buildQueryFromString from 'app/helpers/queryStuff'

		let queryStrings = [
			'dept: Computer Science  dept: Asian Studies  name: Parallel  level: 300  year: $OR year:2013 year: 2014',
			'dept: ASIAN  Dept: Religion  title: "Japan*"  LEVEL: 200  year: 2014  semester: $OR  semester: 3  semester: 1',
			'department: American Conversations  name: Independence  year: 2014  time: Tuesdays after 12',
			'ges: $AND  geneds: history of western culture gened: HBS  semester: Spring  year: 2014',
			'History of Asia',
		]

		let expectedResults = [
			{
				depts: ['$AND', 'CSCI', 'ASIAN'],
				title: ['Parallel'],
				level: [300],
				year: ['$OR', 2013, 2014],
			},
			{
				depts: ['$AND', 'ASIAN', 'REL'],
				title: ['"Japan*"'],
				level: [200],
				year: [2014],
				sem: ['$OR', 3, 1],
			},
			{
				depts: ['AMCON'],
				title: ['Independence'],
				year: [2014],
				times: ['tuesdays after 12'],
			},
			{
				gereqs: ['$AND', 'HWC', 'HBS'],
				sem: [3],
				year: [2014],
			},
			{
				title: ['History of Asia'],
			},
		]

		buildQueryFromString(queryStrings[0]).should.eql(expectedResults[0])
		buildQueryFromString(queryStrings[1]).should.eql(expectedResults[1])
		buildQueryFromString(queryStrings[2]).should.eql(expectedResults[2])
		buildQueryFromString(queryStrings[3]).should.eql(expectedResults[3])
		buildQueryFromString(queryStrings[4]).should.eql(expectedResults[4])
	})
})
