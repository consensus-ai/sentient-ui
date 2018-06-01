import { combineReducers } from 'redux'
import wallet from './wallet.js'
import passwordprompt from './passwordprompt.js'
import newwalletdialog from './newwalletdialog.js'
import sendview from './sendview.js'
import receiveview from './receiveview.js'

const rootReducer = combineReducers({
	wallet,
	passwordprompt,
	newwalletdialog,
	sendview,
	receiveview,
})

export default rootReducer
