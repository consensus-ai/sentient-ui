/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import SendView from '../../plugins/Wallet/js/components/sendview.js'

const testActions = {
	setSendAddress: spy(),
	setSendAmount: spy(),
	sendCurrency: spy(),
	closeSendView: spy(),
	setSendError: spy(),
}

const sendviewComponentSen = shallow(<SendView currencytype="sen" sendAddress="testaddr" sendAmount="1" sendError="" actions={testActions} />)
const sendviewComponentSF = shallow(<SendView currencytype="senfunds" sendAddress="testaddr" sendAmount="1" sendError="" actions={testActions} />)

describe('wallet send prompt component', () => {
	it('renders a modal with one child', () => {
		expect(sendviewComponentSen.find('.modal')).to.have.length(1)
	})
	it('renders send amount with the correct currency', () => {
		expect(sendviewComponentSen.find('.sendamount h3').first().text()).to.contain('Send Amount (SEN)')
		expect(sendviewComponentSF.find('.sendamount h3').first().text()).to.contain('Send Amount (SF)')
	})
	it('renders send amount input with sendAmount value', () => {
		expect(sendviewComponentSen.find('.sendamount input').first().props().value).to.equal('1')
	})
	it('renders a send-view-buttons div with two buttons', () => {
		expect(sendviewComponentSen.find('.send-view-buttons').first().children()).to.have.length(2)
	})
	it('calls closeSendView on cancel click', () => {
		sendviewComponentSen.find('.cancel-send-button').first().simulate('click')
		expect(testActions.closeSendView.called).to.be.true
	})
	it('calls sendCurrency with correct currency and value on send click', () => {
		sendviewComponentSen.find('.send-sen-button').first().simulate('click')
		expect(testActions.sendCurrency.calledWith('testaddr', '1', 'sen')).to.be.true
		testActions.sendCurrency.reset()
		sendviewComponentSF.find('.send-sen-button').first().simulate('click')
		expect(testActions.sendCurrency.calledWith('testaddr', '1', 'senfunds')).to.be.true
	})
	it('calls setSendAddress on sendaddress change', () => {
		sendviewComponentSen.find('.sendaddress input').first().simulate('change', {target: {value: 'newaddress'}})
		expect(testActions.setSendAddress.calledWith('newaddress')).to.be.true
	})
	it('calls setSendAmount on sendamount change', () => {
		sendviewComponentSen.find('.sendamount input').first().simulate('change', {target: {value: '100'}})
		expect(testActions.setSendAmount.calledWith('100')).to.be.true
	})
})
/* eslint-enable no-unused-expressions */
