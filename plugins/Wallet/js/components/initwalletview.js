import PropTypes from 'prop-types'
import React from 'react'
import { toast } from 'react-toastify'
const {clipboard} = require('electron')
const fs = require('fs')
const {dialog} = require('electron').remote

const InitWalletView = ({showCreatePasswordView, showGenerateSeedView, showImportSeedView, showBackupSeedView, showWalletInitializingView, password, passwordConfirmation, generateNewSeed, seed, confirmSeedBackup, error, actions}) => {

  if (showCreatePasswordView) {
    const MIN_PASSWORD_LENGTH = 8

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        onClickSavePassword()
      }
    }
    const onChangePassword = (e) => {
      actions.setPassword(e.target.value)
    }
    const onChangePasswordConfirmation = (e) => {
      actions.setPasswordConfirmation(e.target.value)
    }
    const onClickSavePassword = (e) => {
      if (password.length >= MIN_PASSWORD_LENGTH && passwordConfirmation === password) {
        actions.setShowCreatePasswordView(false)
        actions.setShowGenerateSeedView(true)
      }
    }

    var passwordValidationStatusClass = ""
    var passwordValidationStatusWidth = Math.min(password.length/MIN_PASSWORD_LENGTH, 1) * 100 + "%"
    if (password.length > 0 && password.length < MIN_PASSWORD_LENGTH) {
      passwordValidationStatusClass = "invalid"
    } else if (password.length >= MIN_PASSWORD_LENGTH) {
      passwordValidationStatusClass = "valid"
    }

    var passwordConfirmationValidationStatusClass = ""
    var passwordConfirmationValidationStatusWidth = Math.min(passwordConfirmation.length/MIN_PASSWORD_LENGTH, 1) * 100 + "%"
    if (passwordConfirmation !== password || (passwordConfirmation.length > 0 && passwordConfirmation.length < MIN_PASSWORD_LENGTH)) {
      passwordConfirmationValidationStatusClass = "invalid"
    } else if (passwordConfirmation.length >= MIN_PASSWORD_LENGTH && passwordConfirmation === password) {
      passwordConfirmationValidationStatusClass = "valid"
    }

    return (
      <div className="create-password-view" onKeyPress={handleKeyPress}>
        <label className="title">Let's create your Sentient Wallet.<br/>Set a password of 8 symbols minimum.</label>

        <div className="password-field-container">
          <div className={"password-validation-status-container " + (password.length == 0 ? "hidden" : "")}>
            <div className={"password-validation-status " + passwordValidationStatusClass} style={{width: passwordValidationStatusWidth}}></div>
          </div>
          <input name="password-field" id="password-field" className="input-field password-field password" type="password" value={password} placeholder=" " onChange={onChangePassword}/>
          <label htmlFor="password-field" className="input-label">Set a password</label>
        </div>

        <div className="password-field-container">
          <div className={"password-validation-status-container " + (passwordConfirmation.length == 0 ? "hidden" : "")}>
            <div className={"password-validation-status " + passwordConfirmationValidationStatusClass} style={{width: passwordConfirmationValidationStatusWidth}}></div>
          </div>
          <input name="password-confirmation-field" id="password-confirmation-field" className="input-field password-field password-confirmation" type="password" value={passwordConfirmation} placeholder=" " onChange={onChangePasswordConfirmation} />
          <label htmlFor="password-confirmation-field" className="input-label">Confirm password</label>
        </div>

        <div className={"button save-password-button " + (password.length > MIN_PASSWORD_LENGTH && passwordConfirmation === password ? "active" : "")} onClick={onClickSavePassword}>Save password</div>
      </div>
    )
  }

  if (showGenerateSeedView) {
    const onClickGenerateSeedButton = (e) => {
      actions.initNewWallet(password, null)
    }
    const onClickImportSeedButton = (e) => {
      actions.setShowGenerateSeedView(false)
      actions.setShowImportSeedView(true)
    }

    return  (
      <div className="generate-seed-view">
        <label className="title">Now you need to generate a seed - a special mnemonic phrase for wallet recovery.</label>
        <div className={"button generate-seed-button"} onClick={onClickGenerateSeedButton}>Generate a new seed</div>
        <div className={"button import-seed-button"} onClick={onClickImportSeedButton}>I already have a seed and want to import it</div>
      </div>
    )
  }

  if (showImportSeedView) {
    const onChangeSeed = (e) => {
      actions.setSeed(e.target.value)
    }
    const isValidSeed = () => {
      return seed && seed.split(' ').length == 29
    }
    const onClickImportSeedButton = (e) => {
      if (isValidSeed()) {
        actions.initNewWallet(password, seed)
      }
    }

    return (
      <div className="import-seed-view">
        <label className="title">Paste your seed phrase to the form below and click the Import button.</label>
        <textarea className="seed" type="text" name="seed" value={seed} onChange={onChangeSeed} />
        <div className={"button import-seed-button " + (isValidSeed() ? "active" : "")} onClick={onClickImportSeedButton}>Import</div>
      </div>
    )
  }

  if (showBackupSeedView) {
    let copyToastId = null
    const onClickCopySeedToClipboard = (e) => {
      clipboard.writeText(seed)

      if (!toast.isActive(copyToastId)) {
        copyToastId = toast("seed copied to clipboard", {
          autoClose: 3000,
        })
      }
    }
    const onClickDownloadAsTextFile = (e) => {
      dialog.showSaveDialog(function (filePath) {
        if (filePath === undefined) {
          return
        }

        fs.writeFile(filePath, seed, function (err) {
          if (err) {
            dialog.showErrorBox('File save error', err.message)
          } else {
            toast("seed file saved", {
              autoClose: 3000,
            })
          }
        })
      })
    }
    const onClickDismissBackup = (e) => {
      actions.setShowBackupSeedView(false)
      actions.setShowWalletInitializingView(true)
    }

    return (
      <div className="backup-seed-view">
        <label className="title">Save your seed phrase in a safe place. If you lose it, you won't be able to access your funds.</label>
        <div className="seed-container">{seed}</div>
        <div className="actions-container">
          <div className="button copy-to-clipboard-button" onClick={onClickCopySeedToClipboard}>Copy to clipboard</div>
          <div className="button download-button" onClick={onClickDownloadAsTextFile}>Download a text file</div>
        </div>
        <div className={"button dismiss-backup-button"} onClick={onClickDismissBackup}>I saved the seed. Continue.</div>
      </div>
    )
  }

  if (showWalletInitializingView) {
    return (
      <div className="wallet-initializing-view">
        <label className="title">Restoring wallet from seed.<br/>This may take a few minutes...</label>
      </div>
    )
  }

  return null
}

InitWalletView.propTypes = {
  showCreatePasswordView: PropTypes.bool.isRequired,
  showGenerateSeedView: PropTypes.bool.isRequired,
  showImportSeedView: PropTypes.bool.isRequired,
  showBackupSeedView: PropTypes.bool.isRequired,
  showWalletInitializingView: PropTypes.bool.isRequired,

  password: PropTypes.string.isRequired,
  passwordConfirmation: PropTypes.string.isRequired,
  generateNewSeed: PropTypes.bool.isRequired,
  seed: PropTypes.string.isRequired,
  confirmSeedBackup: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
}

export default InitWalletView

