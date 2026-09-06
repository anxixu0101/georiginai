import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeWithMailerLite } from '@/lib/mailerlite'

export type SubscribeState = 'idle' | 'submitting' | 'success' | 'error'

export interface SubscribeFormProps {
  /**
   * Backend hook. Defaults to the MailerLite pipeline (see
   * src/lib/mailerlite.ts); pass this only to override the submission
   * behavior. Visuals and the state machine stay untouched.
   */
  onSubscribe?: (email: string) => Promise<void>
  /** Mono microcopy rendered under the form. */
  microcopy?: string
  /** Optional id prefix for input/label pairing (two instances per page). */
  idPrefix?: string
  /** Optional call-to-action label. */
  buttonLabel?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function DotLoader() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-ep-ink"
          style={{ animation: `ep-dot-loader 1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
    </span>
  )
}

export default function SubscribeForm({
  onSubscribe,
  microcopy,
  idPrefix = 'subscribe',
  buttonLabel = 'Subscribe',
}: SubscribeFormProps) {
  const submit = onSubscribe ?? subscribeWithMailerLite
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubscribeState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const inputId = `${idPrefix}-email`

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (state === 'submitting' || state === 'success') return
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg('Please enter a valid email.')
      setState('error')
      return
    }
    setState('submitting')
    setErrorMsg('')
    try {
      await submit(email.trim())
      setState('success')
    } catch {
      setErrorMsg('Something went wrong — try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div aria-live="polite">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="flex h-14 items-center gap-3">
            <motion.svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
              aria-hidden="true"
            >
              <circle cx="13" cy="13" r="12" fill="#FFD21F" stroke="#141414" strokeWidth="1.5" />
              <path d="M8 13.2l3.2 3.2L18 9.8" fill="none" stroke="#141414" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <p className="font-grotesk text-[15px] font-medium text-ep-ink">
              You&rsquo;re on the list. The next development update lands in your inbox first.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div aria-live="polite">
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`flex flex-col gap-3 sm:flex-row ${state === 'error' ? 'animate-[ep-shake_0.4s_ease-in-out]' : ''}`}
        key={state === 'error' ? errorMsg : 'form'}
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          readOnly={state === 'submitting'}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') {
              setState('idle')
              setErrorMsg('')
            }
          }}
          className={`h-14 flex-1 rounded-[14px] border bg-white px-5 font-grotesk text-[15px] text-ep-ink placeholder:text-ep-muted focus:outline-none ${
            state === 'error'
              ? 'border-ep-error shadow-[0_0_0_3px_rgba(214,69,69,0.25)]'
              : 'border-ep-line focus:border-ep-ink focus:shadow-[0_0_0_3px_rgba(255,210,31,0.45)]'
          }`}
        />
        <button type="submit" disabled={state === 'submitting'} className="ep-btn-primary min-w-[140px]">
          {state === 'submitting' ? <DotLoader /> : buttonLabel}
        </button>
      </form>
      <AnimatePresence>
        {state === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 font-mono text-[12.5px] text-ep-error"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
      {microcopy && state !== 'error' && (
        <p className="mt-3 font-mono text-[12.5px] tracking-[0.04em] text-ep-muted">{microcopy}</p>
      )}
    </div>
  )
}
