import PropTypes from 'prop-types'
import React from 'react'

const InitWalletView = ({showInitWalletView, showInitBackupWalletView, showInitSeedView, password, passwordConfirmation, generateNewSeed, seed, confirmSeedBackup, error, actions}) => {
  const onChangePassword = (e) => {
    actions.setPassword(e.target.value)
  }
  const onChangePasswordConfirmation = (e) => {
    actions.setPasswordConfirmation(e.target.value)
  }
  const onChangeGenerateNewSeed = (e) => {
    actions.setGenerateNewSeed(e.target.value.toLowerCase() == "true")
  }
  const onConfirmSeedBackup = (e) => {
    actions.setConfirmSeedBackup(e.target.checked)
  }
  const onChangeSeed = (e) => {
    actions.setSeed(e.target.value)
  }
  const onClickSubmit = (e) => {
    if (password.length < 8) {
      actions.setInitWalletError("password is too short")
      return false
    }

    if (password != passwordConfirmation) {
      actions.setInitWalletError("passwords don't match")
      return false
    }

    if (generateNewSeed) {
      actions.setInitWalletError('')
      actions.initNewWallet(password, null)
    } else {
      let chunks = seed.trim().split(' ')
      if (chunks.length != 29) {
        actions.setInitWalletError("invalid seed")
        return false
      }

      actions.setInitWalletError('')
      actions.initNewWallet(password, seed.trim())
    }

    return true
  }

  const onClickDismissBackupView = () => {
    if (confirmSeedBackup) {
      actions.hideInitBackupWalletView()
    }
  }

  const initWalletView = (
    <div className="init-wallet-view">
      <label className="password-label">Create a password to encrypt your wallet with.</label>
      <input className="password-field password" type="password" placeholder="Password" value={password} onChange={onChangePassword}/>
      <input className="password-field password-confirmation" type="password" placeholder="Confirm password" value={passwordConfirmation} onChange={onChangePasswordConfirmation} />

      <div className="seed-options-container">
        <label className="seed-label">
          <input className="seed-radio" type="radio" name="generateseed" value={true} id="generate-seed-yes" checked={generateNewSeed} onChange={onChangeGenerateNewSeed} />
          Create a new wallet (a new seed will be securely generated for you)
        </label>
        <label className="seed-label">
          <input className="seed-radio" type="radio" name="generateseed" value={false} id="generate-seed-no" checked={!generateNewSeed} onChange={onChangeGenerateNewSeed} />
          Import an existing seed
        </label>
      </div>

      {!generateNewSeed &&
        <textarea className="seed" type="text" name="seed" placeholder="Seed" disabled={generateNewSeed} value={seed} onChange={onChangeSeed} />
      }

      <div className="error-container">{error}</div>

      <div className="button create-button" type="submit" onClick={onClickSubmit}>Create</div>
    </div>
  )

  const initBackupWalletView = (
    <div className="init-backup-wallet-view">
      <div className="seed-label">This is your seed:</div>
      <div className="seed-container">{seed}</div>
      <div className="seed-warning">
        WARNING! Make sure to save this seed in a secure location offline.
        Do not share this seed with anyone.
        If you lose this seed, it will be impossible to recover your funds.
      </div>

      <label className="confirm-label">
        <input className="confirm-checkbox" type="checkbox" name="confirm-seed-backup" id="confirm-seed-backup" value={true} checked={confirmSeedBackup} onChange={onConfirmSeedBackup} />
        I confirm that my seed is backed up and safe
      </label>
      <div className={"button dismiss-backup-button " + (confirmSeedBackup ? "active" : "")} onClick={onClickDismissBackupView}>Done</div>
    </div>
  )

  const initSeedView = (
    <div className="init-seed-view">
      <div>Restoring wallet from seed. This may take a few minutes...</div>
    </div>
  )

  if (showInitWalletView) {
     return initWalletView
  }

  if (showInitBackupWalletView) {
    return initBackupWalletView
  }

  if (showInitSeedView) {
    return initSeedView
  }

  return null
}

InitWalletView.propTypes = {
  showInitWalletView: PropTypes.bool.isRequired,
  showInitBackupWalletView: PropTypes.bool.isRequired,
  showInitSeedView: PropTypes.bool.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirmation: PropTypes.string.isRequired,
  generateNewSeed: PropTypes.bool.isRequired,
  seed: PropTypes.string.isRequired,
  confirmSeedBackup: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
}

export default InitWalletView

