import PropTypes from 'prop-types'
import React from 'react'

// -- helper functions --

// currentEstimatedHeight returns the estimated block height for the current time.
const currentEstimatedHeight = () => {
	const knownBlockHeight = 1
	// Development
	// const knownBlockTime = new Date(1531008194*1000)
	// const blockTime = 2 //minutes
	// Production
	const knownBlockTime = new Date(1533310707*1000)
	const blockTime = 10 //minutes
	const diffMinutes = Math.abs(new Date() - knownBlockTime) / 1000 / 60

	const estimatedHeight = knownBlockHeight + (diffMinutes / blockTime)

	return Math.floor(estimatedHeight + 0.5) // round to the nearest block
}

// estimatedProgress returns the estimated sync progress given the current
// blockheight, as a number from 0 -> 99.9
const estimatedProgress = (currentHeight) =>
	Math.min(currentHeight / currentEstimatedHeight() * 100, 99.9)

// -- components --

const StatusBar = ({synced, blockheight, peers}) => {
	let progress = estimatedProgress(blockheight) || 0
	if (progress > 80 && !synced && peers > 0) {
		progress = 80;
	}

	const redColor = '#E0000B'
	const blueColor = '#0043A4'
	const grayColor = 'rgba(61,75,102,0.4)'

	let progressBarContainerStyle = {
		display: 'inline-block',
		backgroundColor: '#F5F7FA',
		height: '4px',
		width: '100%',
		borderRadius: '2px',
	}

	let progressBarStyle = {
		width: progress.toString() + '%',
		height: '4px',
		transition: 'width 200ms',
		backgroundColor: blueColor,
		margin: '0',
		borderRadius: '2px',
	}

	let statusTextStyle = {
		display: 'inline-block',
		color: grayColor,
		fontSize: '14px',
	}

	let percentTextStyle = {
		display: 'inline-block',
		color: grayColor,
		fontSize: '14px',
		position: 'absolute',
		right: '17px',
		bottom: '3px',
	}

	let statusText
	let progressText = Math.round(progress) + "%"
	if (!synced && peers === 0) {
		progressBarStyle.backgroundColor = redColor
		statusText = 'Not Synchronizing'
		progressText = ''
	} else if (synced && peers === 0) {
		progressBarStyle.backgroundColor = redColor
		statusText = 'No Peers'
	} else if (!synced && peers > 0) {
		statusText = 'Synchronizing'
	} else if (synced) {
		statusText = 'Synchronized'
		progressText = 'blocks: ' + blockheight
	}

	return (
		<div className="status-container">
			<div className="progress-container">
				<div style={progressBarContainerStyle}>
					<div style={progressBarStyle}>
					</div>
				</div>
			</div>

			<div style={statusTextStyle}>
				{statusText}
			</div>

			<div style={percentTextStyle}>
				{progressText}
			</div>
		</div>
	)
}

StatusBar.propTypes = {
	synced: PropTypes.bool.isRequired,
	blockheight: PropTypes.number.isRequired,
	peers: PropTypes.number.isRequired,
}

export default StatusBar

