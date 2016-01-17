import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import Button from './button'
import Icon from './icon'
import Requirement from './requirement'
import ProgressBar from './progress-bar'
import compareProps from '../helpers/compare-props'

import './area-of-study.scss'

function AreaOfStudy(props) {
	const {
		addOverride,
		area,
		confirmRemoval,
		endRemovalConfirmation,
		isOpen,
		removeArea,
		removeOverride,
		showCloseButton,
		startRemovalConfirmation,
		toggleAreaExpansion,
		toggleOverride,
	} = props

	const {
		type,
		revision,
		slug,
		isCustom,
		name,
		_progress: progress,
		_error: error,
		_checked: checked,
	} = area

	const progressAt = typeof progress !== 'undefined' ? progress.at : 0
	const progressOf = typeof progress !== 'undefined' ? progress.of : 1

	const summary = (
		<div>
			<div className='area--summary-row'>
				<h1 className='area--title'>
					{slug && !isCustom && isOpen
						? <a className='catalog-link'
							href={`http://catalog.stolaf.edu/academic-programs/${slug}/`}
							target='_blank'
							onClick={ev => ev.stopPropagation()}
							title='View in the St. Olaf Catalog'
						>
							{name}
						</a>
						: name}
				</h1>
				<span className='icons'>
					{showCloseButton &&
					<Button className='area--remove-button' onClick={startRemovalConfirmation}>
						<Icon name='close' />
					</Button>}
					<Icon
						className='area--open-indicator'
						name={isOpen ? 'chevron-up' : 'chevron-down'}
					/>
				</span>
			</div>
			<ProgressBar
				className={cx('area--progress', {error: error})}
				colorful={true}
				value={progressAt}
				max={progressOf}
			/>
		</div>
	)

	const removalConfirmation = (
		<div className='area--confirm-removal'>
			<p>Remove <strong>{name}</strong>?</p>
			<span className='button-group'>
				<Button
					className='area--actually-remove-area'
					onClick={ev => removeArea({ev, areaQuery: {name, type, revision}})}
				>
					Remove
				</Button>
				<Button onClick={endRemovalConfirmation}>Cancel</Button>
			</span>
		</div>
	)

	let contents = null
	if (error) {
		contents = <p className='message area--error'>{error} {':('}</p>
	}
	else if (!checked) {
		contents = <p className='message area--loading'>Loading…</p>
	}
	else {
		contents = (
			<Requirement
				{...area}
				topLevel
				addOverride={addOverride}
				toggleOverride={toggleOverride}
				removeOverride={removeOverride}
				path={[type, name]}
			/>
		)
	}

	return (
		<div className={cx('area', {errored: Boolean(error)}, {loading: !checked})}>
			<div
				className='area--summary'
				onClick={toggleAreaExpansion}
			>
				{confirmRemoval
					? removalConfirmation
					: summary}
			</div>
			{isOpen && !confirmRemoval && contents}
		</div>
	)
}
AreaOfStudy.propTypes = {
	addOverride: PropTypes.func.isRequired,
	area: PropTypes.object.isRequired,
	confirmRemoval: PropTypes.bool.isRequired,
	endRemovalConfirmation: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	removeArea: PropTypes.func.isRequired,
	removeOverride: PropTypes.func.isRequired,
	showCloseButton: PropTypes.bool.isRequired,
	startRemovalConfirmation: PropTypes.func.isRequired,
	toggleAreaExpansion: PropTypes.func.isRequired,
	toggleOverride: PropTypes.func.isRequired,
}

export default class AreaOfStudyContainer extends Component {
	static propTypes = {
		addOverride: PropTypes.func.isRequired,
		area: PropTypes.shape({
			_checked: PropTypes.bool,
			_error: PropTypes.string,
			_progress: PropTypes.shape({
				at: PropTypes.number.isRequired,
				of: PropTypes.number.isRequired,
			}),
			data: PropTypes.object,
			isCustom: PropTypes.bool,
			name: PropTypes.string.isRequired,
			revision: PropTypes.string.isRequired,
			slug: PropTypes.string,
			type: PropTypes.string.isRequired,
		}).isRequired,
		removeArea: PropTypes.func.isRequired,
		removeOverride: PropTypes.func.isRequired,
		showCloseButton: PropTypes.bool.isRequired,
		showEditButton: PropTypes.bool.isRequired,
		studentId: PropTypes.string.isRequired,
		toggleOverride: PropTypes.func.isRequired,
	};

	static defaultProps = {
		area: {
			_progress: {
				word: 'zero',
				at: 0,
				of: 1,
			},
			_error: '',
			_checked: false,
			name: 'Unknown Area',
			type: '???',
			revision: '0000-00',
		},
	};

	constructor() {
		super()
		this.state = {
			isOpen: false,
			confirmRemoval: false,
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return compareProps(this.props, nextProps) || compareProps(this.state, nextState)
	}

	startRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: true})
	};

	endRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: false})
	};

	toggleAreaExpansion = ev => {
		ev.preventDefault()
		this.setState({isOpen: !this.state.isOpen})
	};

	render() {
		const { area } = this.props

		return (
			<AreaOfStudy
				addOverride={this.props.addOverride}
				area={area}
				confirmRemoval={this.state.confirmRemoval}
				endRemovalConfirmation={this.endRemovalConfirmation}
				isOpen={this.state.isOpen}
				removeArea={this.props.removeArea}
				removeOverride={this.props.removeOverride}
				showCloseButton={this.props.showCloseButton}
				startRemovalConfirmation={this.startRemovalConfirmation}
				toggleAreaExpansion={this.toggleAreaExpansion}
				toggleOverride={this.props.toggleOverride}
			/>
		)
	}
}