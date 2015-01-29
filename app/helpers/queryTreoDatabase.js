// import queryTreoDatabase from 'path/to/queryTreoDatabase'
// let db = treo('databaseName', schema)
//   .use(queryTreoDatabase)

function plugin(db, treo) {
	let {Store, Index} = treo

	Store.prototype.query = queryStore
	Index.prototype.query = queryIndex
}

export default plugin

//////

import {
	any,
	contains,
	curry,
	filter,
	findIndex,
	first,
	isEqual,
	isString,
	keys,
	last,
	map,
	reject,
	size,
	uniq,
	flatten,
	startsWith} from 'lodash'

import Promise from 'bluebird'
import idbRange from 'idb-range'
import {cmp as idbComparison} from 'treo'
import {checkCourseAgainstQuery as checkAgainstQuery} from 'sto-helpers'

function defer() {
	let resolve, reject
	let promise = new Promise(() => {[resolve, reject] = arguments})
	return {resolve, reject, promise}
}

function canAdd({query, currentValue, primaryKey, results}={}) {
	// Check if we want to add the current value to the results array.
	// Essentially, make sure that the current value passes the query,
	// and then that it's not already in the array.
	// Note that because JS checks against identity, we use isEqual to
	// do an equality check against the two objects.
	return checkAgainstQuery(query, currentValue) && !contains(results, primaryKey)
}

function queryStore(query) {
	return new Promise((resolvePromise, rejectPromise) => {
		// Take a query object.
		// Grab a key out of it to operate on an index.
		// Set up a range from the low and high value from the values for that key.
		// Iterate over that range and index, checking each value against the query
		//     and making sure not to add duplicates.
		// Return the results.

		let results = []
		// Prevent invalid logic from not having a query.
		if (!size(query))
			return results

		// Grab a key from the query to use as an index.
		// TODO: Write a function to sort keys by priority.
		let indexKeys = keys(query)
		// // <this is a very hacky way of prioritizing the deptnum>
		// if (contains(keysWithIndices, 'deptnum')) {
		// 	keysWithIndices.splice(findIndex('deptnum'), 1)
		// 	keysWithIndices.unshift('deptnum')
		// }

		// Filter down to just the requested keys that also have indices
		let keysWithIndices = filter(indexKeys, (key) => this.index(key))

		// If the current store doesn't have an index for any of the
		// requested keys, iterate over the entire store.
		if (!size(keysWithIndices)) {
			this.cursor({
				iterator: iterateStore({results, query})
			}, done)
			function done(err) {
				if (err)
					rejectPromise(err)
				Promise.all(this.batchGet(results)).then(resolvePromise)
			}
		}

		else {
			let indices = filter(this.indexes, index => contains(keysWithIndices, index.name))

			let resultPromises = map(indices,
				index => index.query(query, {primaryKeysOnly: true}))

			let allFoundKeys = Promise.all(resultPromises)

			let allValues = allFoundKeys
				.then(keys => flatten(keys))
				.then(keys => this.batchGet(keys))

			Promise.all(allValues).then(resolvePromise)
		}
	})
}


function queryIndex(query, {primaryKeysOnly=false}={}) {
	return new Promise((resolvePromise, rejectPromise) => {
		// - takes a query object
		// - filters down the props to just the current index's name
		// - if there aren't any keys to look for under the current index, return []
		// - otherwise, execute the query

		let results = []

		// Prevent invalid logic from not having a query.
		if (!query || !size(query) || !size(query[this.name]))
			return results

		// The index of our current key
		let current = 0
		// Which iterator to use (iterateIndex, unless there aren't any indices)
		let iterator = iterateIndex
		// A range to limit ourselves to
		let range = undefined
		// The keys to look for; the list of permissible values for that range from the query
		let keys = query[this.name]
		keys = reject(keys, key => startsWith(key, '$'))

		if (!keys.length) {
			return results
		}

		// If we have any keys, sort them according to the IDB spec
		keys = keys.sort(idbComparison)

		let firstKey = first(keys)
		let lastKey = last(keys)

		range = idbRange({
			gte: firstKey,
			// If it's a string, append `uffff` because that's the highest
			// value in Unicode, which lets us make sure and iterate over all
			// values that we need.
			// hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb
			lte: isString(lastKey) ? lastKey + 'uffff' : lastKey,
		})

		let done = (err) => {
			if (err) {
				rejectPromise(err)
			}
			else if (primaryKeysOnly) {
				resolvePromise(results)
			}
			else {
				Promise
					.all(this.objectStore.batchGet(resultIds))
					.then(resolvePromise)
			}
		}

		this.cursor({
			range,
			iterator: iterateIndex({primaryKeysOnly, results, keys, done, current, query})
		}, done)
	})
}


let iterateStore = curry(function({query, results=[]}={}, cursor) {
	let {value, primaryKey} = cursor
	if (canAdd({query, value, primaryKey, results})) {
		resultIds.push(primaryKey)
	}
	cursor.continue()
})


let iterateIndex = curry(function({done, query, current=0, keys=[], results=[], primaryKeysOnly=false}={}, cursor) {
	// console.log('key', keys[current], 'idx', current)

	if (current > keys.length) {
		// console.log('done')
		// If we're out of keys, quit.
		done()
	}

	else if (cursor.key > keys[current]) {
		// console.log('greater')
		// If the cursor's key is "past" the current one, we need to skip
		// ahead to the next one key in the list of keys.
		let {value, primaryKey} = cursor
		if (canAdd({query, value, primaryKey, results})) {
			// console.log('adding', value)
			results.push(primaryKey)
		}
		current += 1

		// If we attempt to continue to a key that is before or equal
		// to the current cursor.key, IDB throws an error.
		// Therefore, if the current key equals the current key, we
		// just go forward by one.
		let nextKey = (keys[current] === cursor.key) ? undefined : keys[current]
		cursor.continue(nextKey)
	}

	else if (cursor.key === keys[current]) {
		// console.log('equals')
		// If we've found what we're looking for, add it, and go to
		// the next result.
		let {value, primaryKey} = cursor
		if (canAdd({query, value, primaryKey, results})) {
			// console.log('adding', value)
			results.push(primaryKey)
		}
		cursor.continue()
	}

	else {
		// console.log('other')
		// Otherwise, we're not there yet, and need to skip ahead to the
		// first occurrence of our current key.
		cursor.continue(keys[current])
	}
})
