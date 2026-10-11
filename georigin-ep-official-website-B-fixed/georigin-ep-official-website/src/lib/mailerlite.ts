/**
 * MailerLite subscription bridge.
 *
 * The hidden MailerLite embed form, the official webforms script and the
 * global success callback all live in index.html (same account/form as the
 * old static site: account 2012891, form 35246848). This module submits
 * through that real form — MailerLite's own script does the AJAX post and,
 * on success, its global callback dispatches the `ml:subscribed` DOM event
 * that resolves the promise below.
 */

const SUCCESS_EVENT = 'ml:subscribed'
const TIMEOUT_MS = 12000

export function subscribeWithMailerLite(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const root = document.getElementById('mlb2-35246848')
    const input = root?.querySelector<HTMLInputElement>('input[type="email"]')
    const button = root?.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!input || !button) {
      reject(new Error('MailerLite form is not available'))
      return
    }

    let settled = false
    const onSuccess = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      window.removeEventListener(SUCCESS_EVENT, onSuccess)
      resolve()
    }
    const timer = window.setTimeout(() => {
      if (settled) return
      settled = true
      window.removeEventListener(SUCCESS_EVENT, onSuccess)
      reject(new Error('Subscription request timed out'))
    }, TIMEOUT_MS)
    window.addEventListener(SUCCESS_EVENT, onSuccess)

    input.value = email
    button.click()
  })
}
