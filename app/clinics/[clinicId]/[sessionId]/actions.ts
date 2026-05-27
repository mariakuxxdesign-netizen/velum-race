"use server";

import { getClinicSession } from "@/lib/clinics";
import { createRegistration } from "@/lib/registrations";

export type RegistrationState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitRegistration(_: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const clinicId = String(formData.get("clinicId") || "");
  const sessionId = String(formData.get("sessionId") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const sailingLevel = String(formData.get("sailingLevel") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !phone) {
    return {
      status: "error",
      message: "Please fill in your name, email and phone."
    };
  }

  const details = await getClinicSession(clinicId, sessionId);

  if (!details) {
    return {
      status: "error",
      message: "This clinic date is no longer available."
    };
  }

  try {
    await createRegistration({
      clinicId,
      clinicTitle: details.clinic.title,
      sessionId,
      sessionDate: details.session.date,
      sessionLocation: details.session.location,
      name,
      email,
      phone,
      country,
      sailingLevel,
      message
    });

    return {
      status: "success",
      message: "Thank you. Your registration request has been sent."
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not send the registration."
    };
  }
}
