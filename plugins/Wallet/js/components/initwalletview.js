import PropTypes from 'prop-types'
import React from 'react'

const InitWalletView = ({showInitWalletView, showInitBackupWalletView, showInitSeedView, password, passwordConfirmation, generateNewSeed, seed, error, actions}) => {
  const onChangePassword = (e) => {
    actions.setPassword(e.target.value)
  }
  const onChangePasswordConfirmation = (e) => {
    actions.setPasswordConfirmation(e.target.value)
  }
  const onChangeGenerateNewSeed = (e) => {
    actions.setGenerateNewSeed(e.target.value.toLowerCase() == "true")
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
    actions.hideInitBackupWalletView()
  }

  const initWalletView = (
    <div className="init-wallet-view">
      <input className="password-field" type="password" placeholder="password" value={password} onChange={onChangePassword}/>
      <input className="password-field" type="password" placeholder="confirm password" value={passwordConfirmation} onChange={onChangePasswordConfirmation} />

      <label>
        <input type="radio" name="generateseed" value={true} id="generate-seed-yes" checked={generateNewSeed} onChange={onChangeGenerateNewSeed} />
        Generate a new seed
      </label>
      <label>
        <input type="radio" name="generateseed" value={false} id="generate-seed-no" checked={!generateNewSeed} onChange={onChangeGenerateNewSeed} />
        Import an existing seed
      </label>

      <input type="text" name="seed" placeholder="Seed" disabled={generateNewSeed} value={seed} onChange={onChangeSeed} />

      <div className="error-container">{error}</div>

      <button type="submit" onClick={onClickSubmit}>Create</button>
    </div>
  )

  const initBackupWalletView = (
    <div className="init-backup-wallet-view">
      <div className="seed-container">{seed}</div>
      <div className="password-container">{password}</div>
      <button onClick={onClickDismissBackupView}>DONE</button>
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
  error: PropTypes.string.isRequired,
}

export default InitWalletView

