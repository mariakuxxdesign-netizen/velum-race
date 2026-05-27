export type RegistrationInput = {
  clinicId: string;
  clinicTitle: string;
  sessionId: string;
  sessionDate: string;
  sessionLocation: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  sailingLevel: string;
  message: string;
};

export type Registration = RegistrationInput & {
  id: string;
  createdAt: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function createRegistration(input: RegistrationInput) {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Registration storage is not configured yet.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      clinic_id: input.clinicId,
      clinic_title: input.clinicTitle,
      session_id: input.sessionId,
      session_date: input.sessionDate,
      session_location: input.sessionLocation,
      name: input.name,
      email: input.email,
      phone: input.phone,
      country: input.country,
      sailing_level: input.sailingLevel,
      message: input.message
    })
  });

  if (response.status === 404) {
    throw new Error("Registration table is not ready yet. Please run the updated Supabase SQL.");
  }

  if (!response.ok) {
    throw new Error("Could not save the registration. Please try again.");
  }
}

export async function getRegistrations(): Promise<Registration[]> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return [];
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/registrations?select=*&order=created_at.desc`, {
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`
    },
    cache: "no-store"
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Could not load registrations.");
  }

  const rows = (await response.json()) as Array<{
    id: string;
    clinic_id: string;
    clinic_title: string;
    session_id: string;
    session_date: string;
    session_location: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    sailing_level: string;
    message: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    clinicId: row.clinic_id,
    clinicTitle: row.clinic_title,
    sessionId: row.session_id,
    sessionDate: row.session_date,
    sessionLocation: row.session_location,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    sailingLevel: row.sailing_level,
    message: row.message,
    createdAt: row.created_at
  }));
}
