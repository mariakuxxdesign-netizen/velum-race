import type { Clinic, ClinicSession } from "./clinics";

export function createSession(): ClinicSession {
  return {
    id: crypto.randomUUID(),
    date: "",
    location: "",
    url: ""
  };
}

export function createClinic(): Clinic {
  return {
    id: crypto.randomUUID(),
    title: "",
    imageUrl: "",
    sessions: [createSession()]
  };
}
