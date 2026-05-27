import { promises as fs } from "fs";
import path from "path";
import { createSession } from "./clinic-factory";

export type ClinicSession = {
  id: string;
  date: string;
  location: string;
  url: string;
};

export type Clinic = {
  id: string;
  title: string;
  imageUrl: string;
  sessions: ClinicSession[];
};

const dataFile = path.join(process.cwd(), "data", "clinics.json");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function hasSupabase() {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

async function getLocalClinics(): Promise<Clinic[]> {
  const content = await fs.readFile(dataFile, "utf8");
  return normalizeClinics(JSON.parse(content) as Clinic[]);
}

function normalizeClinics(clinics: Clinic[]): Clinic[] {
  return clinics.map((clinic, clinicIndex) => ({
    id: clinic.id || `clinic-${clinicIndex + 1}`,
    title: clinic.title || "Clinic title",
    imageUrl: clinic.imageUrl || "",
    sessions: (clinic.sessions.length ? clinic.sessions : [createSession()]).map((session, sessionIndex) => ({
      id: session.id || `${clinic.id || `clinic-${clinicIndex + 1}`}-session-${sessionIndex + 1}`,
      date: session.date || "",
      location: session.location || "",
      url: session.url || ""
    }))
  }));
}

export async function getClinics(): Promise<Clinic[]> {
  if (hasSupabase()) {
    const response = await fetch(`${supabaseUrl}/rest/v1/clinics?select=*&order=sort_order.asc`, {
      headers: {
        apikey: supabaseServiceKey!,
        Authorization: `Bearer ${supabaseServiceKey}`
      },
      cache: "no-store"
    });

    if (response.status === 404) {
      return getLocalClinics();
    }

    if (!response.ok) {
      throw new Error("Unable to load clinics from Supabase.");
    }

    const rows = (await response.json()) as Array<{
      id: string;
      title: string;
      image_url: string;
      sessions: ClinicSession[];
    }>;

    return normalizeClinics(
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        imageUrl: row.image_url,
        sessions: row.sessions || []
      }))
    );
  }

  return getLocalClinics();
}

export async function getClinicSession(clinicId: string, sessionId: string) {
  const clinics = await getClinics();
  const clinic = clinics.find((item) => item.id === clinicId);
  const session = clinic?.sessions.find((item) => item.id === sessionId);

  if (!clinic || !session) {
    return null;
  }

  return { clinic, session };
}

export async function saveClinics(clinics: Clinic[]): Promise<void> {
  const normalized = normalizeClinics(clinics);

  if (hasSupabase()) {
    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/clinics?id=not.is.null`, {
      method: "DELETE",
      headers: {
        apikey: supabaseServiceKey!,
        Authorization: `Bearer ${supabaseServiceKey}`
      }
    });

    if (!deleteResponse.ok) {
      throw new Error("Unable to replace clinics in Supabase.");
    }

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/clinics`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceKey!,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(
        normalized.map((clinic, index) => ({
          id: clinic.id,
          title: clinic.title,
          image_url: clinic.imageUrl,
          sessions: clinic.sessions,
          sort_order: index
        }))
      )
    });

    if (!insertResponse.ok) {
      throw new Error("Unable to save clinics to Supabase.");
    }

    return;
  }

  await fs.writeFile(dataFile, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}
