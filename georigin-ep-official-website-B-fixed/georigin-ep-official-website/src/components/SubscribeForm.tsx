import { useState } from "react";
import type { FormEvent } from "react";
import { subscribeWithMailerLite } from "@/lib/mailerlite";

export type SubscribeState = "idle" | "submitting" | "success" | "error";

export interface SubscribeFormProps {
  /** Defaults to the original MailerLite bridge; override only for local tests. */
  onSubscribe?: (email: string) => Promise<void>;
  microcopy?: string;
  idPrefix?: string;
  buttonLabel?: string;
  appearance?: "default" | "navy";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeForm({
  onSubscribe,
  microcopy,
  idPrefix = "subscribe",
  buttonLabel = "Subscribe",
  appearance = "default",
}: SubscribeFormProps) {
  const submit = onSubscribe ?? subscribeWithMailerLite;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputId = `${idPrefix}-email`;
  const errorId = `${idPrefix}-error`;
  const helperId = `${idPrefix}-helper`;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (state === "submitting" || state === "success") return;
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      setState("error");
      return;
    }
    setState("submitting");
    setErrorMsg("");
    try {
      await submit(email.trim());
      setState("success");
    } catch {
      setErrorMsg("We couldn’t confirm your subscription. Please try again.");
      setState("error");
    }
  };

  return (
    <div className={`ep-subscribe ep-subscribe--${appearance}`}>
      {state === "success" ? (
        <p className="ep-subscribe-success" role="status">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="11" stroke="currentColor" />
            <path
              d="m7 12 3.5 3.5L17 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          You’re on the list. Watch your inbox for Easing-Point and Kickstarter
          launch updates.
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="ep-subscribe-form"
            aria-busy={state === "submitting"}
          >
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder={
                appearance === "navy" ? "Your email address" : "you@example.com"
              }
              value={email}
              readOnly={state === "submitting"}
              aria-invalid={state === "error"}
              aria-describedby={
                state === "error" ? errorId : microcopy ? helperId : undefined
              }
              onChange={event => {
                setEmail(event.target.value);
                if (state === "error") {
                  setState("idle");
                  setErrorMsg("");
                }
              }}
              className="ep-subscribe-input"
            />
            <button
              type="submit"
              disabled={state === "submitting"}
              className="ep-subscribe-button"
            >
              {state === "submitting" ? "Joining…" : buttonLabel}
            </button>
          </form>
          <div role="status" aria-live="polite">
            {state === "submitting" && (
              <span className="sr-only">Submitting your email address.</span>
            )}
            {state === "error" && (
              <p id={errorId} className="ep-subscribe-error">
                {errorMsg}
              </p>
            )}
          </div>
          {microcopy && state !== "error" && (
            <p id={helperId} className="ep-subscribe-helper">
              {microcopy}
            </p>
          )}
        </>
      )}
    </div>
  );
}
