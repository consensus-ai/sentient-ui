import PropTypes from 'prop-types'
import React from 'react'

// -- helper functions --

// estimatedProgress returns the estimated sync progress given the current
// blockheight, as a number from 0 -> 99.9
const estimatedProgress = (currentHeight, estimatedHeight) =>
	currentHeight * 100 / estimatedHeight

// -- components --

const StatusBar = ({synced, blockheight, peers, explorerheight}) => {
	const progress = estimatedProgress(blockheight, explorerheight) || 0

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
		statusTextStyle.color = redColor
		statusText = 'Not Synchronizing'
	} else if (synced && peers === 0) {
		statusTextStyle.color = redColor
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

