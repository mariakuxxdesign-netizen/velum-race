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
