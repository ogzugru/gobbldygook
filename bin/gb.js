import nom from 'nomnom'
import pkg from '../package.json'

import 'lie/polyfill'
import fs from 'graceful-fs'
import 'isomorphic-fetch'
import {status, json, text} from '../src/lib/fetch-helpers'

function check() {}
function lint() {}


function callbackToPromise(resolve, reject) {
	return (err, results) => {
		err && reject(err)
		resolve(results)
	}
}

function readFilePromise(file, opts) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, opts, callbackToPromise(resolve, reject))
	})
}

function loadFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(text)
		: readFilePromise(pathOrUrl, {encoding: 'utf-8'})
	// return JSON.parse(fs.readFileSync(pathOrUrl, 'utf8'))
}

function loadJsonFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(json)
		: readFilePromise(pathOrUrl, {encoding: 'utf-8'}).then(JSON.parse)
	// return JSON.parse(fs.readFileSync(pathOrUrl, 'utf8'))
}

function loadYamlFile(pathOrUrl) {
	return startsWith(pathOrUrl, 'http')
		? fetch(pathOrUrl).then(status).then(text).then(yaml.safeLoad)
		: readFilePromise(pathOrUrl, {encoding: 'utf-8'}).then(yaml.safeLoad)
}

function tryReadFile(path) {
	try {
		return fs.readFileSync(path, {encoding: 'utf-8'})
	} catch (err) {} // eslint-disable-line brace-style, no-empty

	return false
}

function tryReadJsonFile(path) {
	try {
		return JSON.parse(fs.readFileSync(path, {encoding: 'utf-8'}))
	} catch (err) {} // eslint-disable-line brace-style, no-empty

	return false
}

import mkdirp from 'mkdirp'
import yaml from 'js-yaml'
import startsWith from 'lodash/string/startsWith'
import chain from 'lodash/chain/chain'
import find from 'lodash/collection/find'
import map from 'lodash/collection/map'
import path from 'path'

const COURSE_INFO_LOCATION = process.env.COURSE_INFO || pkg.COURSE_INFO || 'https://stolaf.edu/people/rives/courses/info.json'
const AREA_INFO_LOCATION = process.env.AREA_INFO || pkg.AREA_INFO || 'https://stolaf.edu/people/rives/areas/info.json'

function prepareDirs() {
	mkdirp.sync(`~/Library/Caches/es.riv.Gobbldygook/`)
	mkdirp.sync(`~/Library/Caches/es.riv.Gobbldygook/Courses/`)
	mkdirp.sync(`~/Library/Caches/es.riv.Gobbldygook/Areas of Study/`)
}

function cache() {
	prepareDirs()

	const priorCourseInfo = tryReadJsonFile(`~/Library/Caches/es.riv.Gobbldygook/Courses/info.prior.json`) || {}
	const priorAreaInfo = tryReadJsonFile(`~/Library/Caches/es.riv.Gobbldygook/Areas/info.prior.json`) || {}

	mkdirp.sync(`~/Library/Caches/es.riv.Gobbldygook/Courses/`)

	const courseInfo = loadJsonFile(COURSE_INFO_LOCATION)
		.then(info => {
			info.files
				.filter(file => !find(priorCourseInfo.files, file))
				.map(file => ({
					...file,
					fullPath: path.normalize(`./${path.join(...COURSE_INFO_LOCATION.split('/').slice(0, -1))}/${file.path}`)}))
				.map(file => ({...file, data: loadFile(file.fullPath)}))
				.forEach(file => {
					file.data.then(data => fs.writeFileSync(`~/Library/Caches/es.riv.Gobbldygook/Courses/${path.basename(file.path)}`, data))
				})
			return info
		})
		.then(infoFile => {
			let promises = map(infoFile.files, file => file.data)
			Promise.all(promises).then(() => {
				fs.writeFileSync(`~/Library/Caches/es.riv.Gobbldygook/Courses/info.prior.json`, JSON.stringify(infoFile))

				const infoFileExists = fs.existsSync(`~/Library/Caches/es.riv.Gobbldygook/Courses/info.json`)
				if (!infoFileExists) {
					fs.writeFileSync(`~/Library/Caches/es.riv.Gobbldygook/Courses/info.json`, JSON.stringify(infoFile))
				}
			})
		})
		.catch(err => {throw err}) // eslint-disable-line brace-style

	// const areaInfo = loadJsonFile(AREA_INFO_LOCATION)
	// 	.then(info => {
	// 		const priorInfo = priorAreaInfo
	// 		const needCaching = reject(info.files, file => find(priorInfo.files, file))
	// 		console.log(needCaching)
	// 	})
	// 	.catch(err => {throw err}) // eslint-disable-line brace-style

	return courseInfo

	// return Promise.all([courseInfo, areaInfo])
}

function checkForStaleData() {
	prepareDirs()

	const courseInfo = tryReadJsonFile(`~/Library/Caches/es.riv.Gobbldygook/Courses/info.json`)

	if (!courseInfo) {
		console.warn('Need to cache courses')
		return cache()
	}

	return Promise.resolve(true)
}

function update() {
	// grab info.json
	// apply loadData's algorithm to it
	return cache()
}

import table from 'text-table'
function printCourse(options) {
	return course => {
		if (options.list) {
			return [`${course.year}.${course.semester}`, `${course.depts.join('/')} ${course.num}${(course.section || '').toLowerCase()}`, `${course.title || course.name}`]
		}
		else {
			console.log(
`# ${course.title || course.name} (${course.year}.${course.semester})
${course.depts.join('/')} ${course.num}${(course.section || '').toLowerCase()}

Instructors: ${course.instructors}

${course.desc || ''}
`)
		}
	}
}

import flatten from 'lodash/array/flatten'
import filter from 'lodash/collection/filter'
import forEach from 'lodash/collection/forEach'
import uniq from 'lodash/array/uniq'
function search({riddle, unique, ...opts}={}) {
	console.log(`searched for ${JSON.stringify(riddle, null)}`)
	// check if data has been cached
	checkForStaleData().then(() => {
		let base = `~/Library/Caches/es.riv.Gobbldygook/Courses/`
		let files = flatten(map(fs.readdirSync(base),  fn => tryReadJsonFile(path.join(base, fn))))

		let filtered = filter(files, riddle)
		if (unique) {
			filtered = uniq(filtered, unique)
		}

		if (opts.list) {
			console.log(table(map(filtered, printCourse(opts))))
		}
		else {
			forEach(filtered, printCourse(opts))
		}
	})
}

export function cli() {
	nom.command('check')
		.callback(check)
		.help('check a student')

	nom.command('lint')
		.callback(lint)
		.help('lint (syntax-check) an area file')

	nom.command('update')
		.callback(update)
		.help('update local data cache')

	nom.command('search')
		.callback(search)
		.help('search for a course')
		.option('list', {
			flag: true,
			help: 'Print matching courses in a list',
		})
		.option('unique', {
			flag: false,
			metavar: 'KEY',
			type: 'string',
			transform: yaml.safeLoad,
			help: 'Run a uniquing filter over the list of found courses, based on the given key',
		})
		.option('riddle', {
			type: 'string',
			position: 1,
			transform: yaml.safeLoad,
			help: 'A YAML-encoded filtering object. Passed to lodash.filter.',
		})

	nom.option('version', {
		flag: true,
		help: 'print version and exit',
		callback: () => pkg.version,
	})

	nom.option('v', {
		flag: true,
		help: 'print version and exit',
		callback: () => pkg.version,
	})

	nom.parse()
}
