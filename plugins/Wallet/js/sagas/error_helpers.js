// Helper functions for translating errors from the API into a user-friendly format


// maps error messages returned by the API to user-friendly error messages
const ERROR_MAPPING = {
  "error when calling /wallet/init/seed: cannot init from seed until blockchain is synced": "Cannot restore wallet from seed until blockchain is synchronized",
  "error when calling /wallet/unlock: provided encryption key is incorrect": "The password you entered is incorrect",
  "error when calling /wallet/sen: unable to fund transaction: insufficient balance": "Failed to send transaction - insufficient balance"
}

// userFriendlyError will translate some of the most common errors
// that are seed from the API into a user-friendly string format.
// If an error message is not found in the mapping, return the provided
// error message
export const userFriendlyError = (err) => {
  return ERROR_MAPPING[err.message] || err.message || e.toString()
}
