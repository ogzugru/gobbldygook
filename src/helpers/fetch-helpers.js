import {NetworkError} from './errors'

export function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	}
	else {
		throw new Error(response.statusText)
	}
}

export function classifyFetchErrors(err) {
	if (err instanceof TypeError && err.message === 'Failed to fetch') {
		throw new NetworkError('Failed to fetch')
	}
}

export function json(response) {
	return response.json()
}

export function text(response) {
	return response.text()
}
