import { Map } from 'immutable'
import { SET_SEND_ERROR, SET_FEE_ESTIMATE, SET_SEND_AMOUNT, SET_SEND_ADDRESS } from '../constants/wallet.js'

const initialState = Map({
	sendaddress: '',
	sendamount: '',
	currencytype: 'sen',
	feeEstimate: '0 SEN/KB',
	error: '',
})
export default function sendPromptReducer(state = initialState, action) {
	switch (action.type) {
	case SET_FEE_ESTIMATE:
		return state.set('feeEstimate', action.estimate)
	case SET_SEND_AMOUNT:
		return state.set('sendamount', action.amount)
	case SET_SEND_ADDRESS:
		return state.set('sendaddress', action.address)
	case SET_SEND_ERROR:
		return state.set('error', action.error)
	default:
		return state
	}
}
