import uniqueId from 'lodash/utility/uniqueId'

import Worker from './check-student-against-area.worker.js'
const worker = new Worker()
worker.onerror = msg => console.warn('[main] received error from check-student worker:', msg)


/**
 * Checks a student object against an area of study.
 *
 * @param {Object} student - the student to check
 * @param {Object} area - the area to check against
 * @returns {Promise} - the promise for a result
 * @promise ResultsPromise
 * @fulfill {Object} - The details of the area check.
 */
export default function checkStudentAgainstArea(student) {
	const sourceId = uniqueId()

	return area => new Promise((resolve, reject) => {
		// This is inside of the function so that it doesn't get unregistered too early
		function onMessage({data}) {
			const [resultId, type, contents] = JSON.parse(data)

			if (resultId === sourceId) {
				worker.removeEventListener('message', onMessage)

				if (type === 'result') {
					resolve(contents)
				}
				else if (type === 'error') {
					reject({_error: contents.message})
				}
			}
		}

		worker.addEventListener('message', onMessage)

		/* why stringify? from https://code.google.com/p/chromium/issues/detail?id=536620#c11:
		 * > We know that serialization/deserialization is slow. It's actually faster to
		 * > JSON.stringify() then postMessage() a string than to postMessage() an object. :(
		 */
		worker.postMessage(JSON.stringify([sourceId, student, area]))
	})
}
