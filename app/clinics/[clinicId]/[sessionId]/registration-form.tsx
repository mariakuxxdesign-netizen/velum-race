"use client";

import { useActionState } from "react";
import { RegistrationState, submitRegistration } from "./actions";

const initialState: RegistrationState = {
  status: "idle",
  message: ""
};

type RegistrationFormProps = {
  clinicId: string;
  sessionId: string;
};

export function RegistrationForm({ clinicId, sessionId }: RegistrationFormProps) {
  const [state, formAction, isPending] = useActionState(submitRegistration, initialState);

  return (
    <form action={formAction} className="registration-form">
      <input name="clinicId" type="hidden" value={clinicId} />
      <input name="sessionId" type="hidden" value={sessionId} />

      <div className="field-row">
        <label>
          <span>Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" required type="email" />
        </label>
      </div>

      <div className="field-row">
        <label>
          <span>Phone / WhatsApp</span>
          <input name="phone" required />
        </label>
        <label>
          <span>Country</span>
          <input name="country" />
        </label>
      </div>

      <label>
        <span>Sailing level</span>
        <input name="sailingLevel" placeholder="ILCA 6, ILCA 7, youth, coach..." />
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" rows={5} />
      </label>

      <div className="registration-form__footer">
        <button disabled={isPending} type="submit">
          {isPending ? "Sending..." : "Send registration"}
        </button>
        {state.message ? <p className={`form-message form-message--${state.status}`}>{state.message}</p> : null}
      </div>
    </form>
  );
}
