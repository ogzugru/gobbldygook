// @flow

import {css} from 'styled-components'

export const materialShadow = `
	border: 1px solid;
	border-color: #e5e6e9 #dfe0e4 #d0d1d5;
`

export const baseCard = css`
	background-color: var(--background-color, white);
	border-radius: var(--base-border-radius);
`

export const card = css`
	${baseCard};
	box-shadow: 0 2px 4px 0 rgba(14, 30, 37, 0.12);
`

export const cardContent = `
	padding: 1em;
`

export const cardActions = css`
	border-top: 1px solid rgba(160, 160, 160, 0.2);
	padding: 1em;
`

export const headingNeutral = `
	font-size: inherit;
	font-weight: inherit;
	margin-top: 0;
	margin-bottom: 0;
`

export const linkUndecorated = `
	text-decoration: none;
	color: inherit;
`

export const listInline = `
	display: inline-block;
	list-style: none;
	margin-top: 0;
	margin-bottom: 0;
	padding-left: 0;

	& > li {
		display: inline-block;
	}
`

export const listUnstyled = `
	margin: 0;
	padding: 0;
	list-style: none;
`

export const noSelect = `
	user-select: none;
	cursor: default;
`

export const truncate = `
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const truncateWidth = (width: string) => `
	${truncate}
	width: ${width};
`
