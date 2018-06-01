/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import Wallet from '../../plugins/Wallet/js/components/wallet.js'
import ReceiveButton from '../../plugins/Wallet/js/containers/receivebutton.js'
import ReceiveView from '../../plugins/Wallet/js/containers/receiveview.js'
import NewWalletDialog from '../../plugins/Wallet/js/containers/newwalletdialog.js'
import TransactionList from '../../plugins/Wallet/js/containers/transactionlist.js'
import SendView from '../../plugins/Wallet/js/containers/sendview.js'

const testActions = {
	showSendView: spy(),
}

describe('wallet component', () => {
	afterEach(() => {
		testActions.showSendView.reset()
	})
	it('renders sen send button when senfund balance is zero', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" />)
		expect(walletComponent.find('SendButton')).to.have.length(1)
	})
	it('renders start send prompt with sen when send sen button is clicked', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		walletComponent.find('SendButton').first().simulate('click')
		expect(testActions.showSendView.calledWith('sen')).to.be.true
	})
	it('renders start send prompt with senfunds when send senfunds button is clicked', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" senfundbalance="1" actions={testActions} />)
		walletComponent.find('SendButton [currencytype="Senfund"]').first().simulate('click')
		expect(testActions.showSendView.calledWith('senfunds')).to.be.true
	})
	it('renders a transaction list', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<TransactionList />)).to.be.true
	})
	it('renders a receive button', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<ReceiveButton />)).to.be.true
	})
	it('does not render show new wallet dialog unless showNewWalletDialog', () => {
		const walletComponent = shallow(<Wallet synced showNewWalletDialog={false} confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<NewWalletDialog />)).to.be.false
	})
	it('renders show new wallet dialog when showNewWalletDialog', () => {
		const walletComponent = shallow(<Wallet synced showNewWalletDialog confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<NewWalletDialog />)).to.be.true
	})
	it('does not render show send prompt unless showSendView', () => {
		const walletComponent = shallow(<Wallet synced showSendView={false} confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<SendView />)).to.be.false
	})
	it('renders show send prompt when showSendView', () => {
		const walletComponent = shallow(<Wallet synced showSendView confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<SendView />)).to.be.true
	})
	it('does not render show receive prompt unless showReceiveView', () => {
		const walletComponent = shallow(<Wallet synced showReceiveView={false} confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<ReceiveView />)).to.be.false
	})
	it('renders show receive prompt when showReceiveView', () => {
		const walletComponent = shallow(<Wallet synced showReceiveView confirmedbalance="10" unconfirmedbalance="1" senfundbalance="0" actions={testActions} />)
		expect(walletComponent.contains(<ReceiveView />)).to.be.true
	})
})
/* eslint-enable no-unused-expressions */
