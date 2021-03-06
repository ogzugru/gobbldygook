/* eslint-env jest */
// @flow

jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn())

import parseData from '../parse-data'

test('parseData can parse json', () => {
	expect(parseData('{"foo": 2}', 'courses')).toMatchSnapshot()
})

test('parseData can parse yaml', () => {
	expect(parseData('foo: 2', 'areas')).toMatchSnapshot()
})

test("parseData returns a blank object if it can't parse", () => {
	// $FlowExpectedError
	expect(parseData('foo: 2', 'other')).toMatchSnapshot()
	expect(parseData('invalid', 'courses')).toMatchSnapshot()
	expect(parseData('- invalid: yaml:', 'areas')).toMatchSnapshot()
})
