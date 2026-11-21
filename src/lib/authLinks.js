import { getInitialAuthParams } from './supabase'

export const minimumPasswordLength = 8

// Reads what Supabase put in the email link the user arrived from.
export function getAuthLinkResult() {
  const params = getInitialAuthParams()
  const errorDescription = params.get('error_description') || params.get('error')
  return {
    error: errorDescription ? errorDescription.replace(/\+/g, ' ') : null,
    fromEmailLink: params.has('access_token') || params.has('code') || params.has('token_hash'),
    type: params.get('type')
  }
}
