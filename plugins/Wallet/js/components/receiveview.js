import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'
import { toast } from 'react-toastify'
const {clipboard} = require('electron')

const ReceiveView = ({addresses, address, description, actions}) => {
	const handleGenerateClick = () => {
		actions.getNewReceiveAddress()
		actions.setAddressDescription('')
		actions.saveAddress({ description: description, address: address })
	}

	const handleDescriptionChange = (e) => {
		let addr = e.target.getAttribute('data-address')
		let descr = e.target.value

		actions.updateAddressDescription({ description: descr, address: addr })
	}

	let copyToastId = null
	const handleCopyToClipboard = (e) => {
		let addr = e.target.getAttribute('data-address')
		if (addr) {
			clipboard.writeText(addr)

			if (!toast.isActive(copyToastId)) {
				copyToastId = toast("address copied to clipboard", {
					autoClose: 3000,
				})
			}
		}
	}

	const addressItems = addresses.reverse().map((oldAddress, key) => {
		let index = addresses.size - key
		return (
			<div className="address-row" key={key}>
				<div className="address-col col-index index-bg">{index}</div>
				<div className="address-col col-description">
					<input type="text"
								 className="description-input"
								 placeholder="No description"
								 value={oldAddress.description}
								 onChange={handleDescriptionChange}
								 data-address={oldAddress.address} />
				</div>
				<div className="address-col col-address small-text">{oldAddress.address}</div>
				<div className="address-col col-copy copy-icon"
						 title="Copy"
						 onClick={handleCopyToClipboard}
						 data-address={oldAddress.address}></div>
			</div>
		)
	})

	return (
		<div className="address-list-view">
			<div className="address-row row-header">
				<div className="address-col col-index"></div>
				<div className="address-col col-description"></div>
				<div className="address-col col-address">
					<div className="generate-btn" onClick={handleGenerateClick}>
						<div className="generate-icon"></div>
						<span>Generate new address</span>
					</div>
				</div>
				<div className="address-col col-copy"></div>
			</div>
			<div className="address-items">
				{addressItems}
			</div>
		</div>
	)
}
ReceiveView.propTypes = {
	addresses: PropTypes.instanceOf(List),
	address: PropTypes.string,
	description: PropTypes.string,
}
export default ReceiveView
