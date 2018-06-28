import { MINER_START_ERROR, MINER_STOP_ERROR } from '../constants/error.js'

export const minerStartError = (err) => ({
  type: MINER_START_ERROR,
  err,
})

export const minerStopError = (err) => ({
  type: MINER_STOP_ERROR,
  err,
})
