"use client";

import { useState, useTransition } from "react";
import type { Clinic } from "@/lib/clinics";
import { createClinic, createSession } from "@/lib/clinic-factory";
import { saveClinicList, uploadClinicImage } from "./actions";

type ClinicEditorProps = {
  initialClinics: Clinic[];
};

export function ClinicEditor({ initialClinics }: ClinicEditorProps) {
  const [clinics, setClinics] = useState(initialClinics);
  const [message, setMessage] = useState("");
  const [isSaving, startTransition] = useTransition();

  function updateClinic(clinicId: string, patch: Partial<Clinic>) {
    setClinics((current) => current.map((clinic) => (clinic.id === clinicId ? { ...clinic, ...patch } : clinic)));
  }

  function updateSession(clinicId: string, sessionId: string, patch: Partial<Clinic["sessions"][number]>) {
    setClinics((current) =>
      current.map((clinic) =>
        clinic.id === clinicId
          ? {
              ...clinic,
              sessions: clinic.sessions.map((session) => (session.id === sessionId ? { ...session, ...patch } : session))
            }
          : clinic
      )
    );
  }

  function addClinic() {
    setClinics((current) => [...current, createClinic()]);
  }

  function removeClinic(clinicId: string) {
    setClinics((current) => current.filter((clinic) => clinic.id !== clinicId));
  }

  function addSession(clinicId: string) {
    setClinics((current) =>
      current.map((clinic) => (clinic.id === clinicId ? { ...clinic, sessions: [...clinic.sessions, createSession()] } : clinic))
    );
  }

  function removeSession(clinicId: string, sessionId: string) {
    setClinics((current) =>
      current.map((clinic) =>
        clinic.id === clinicId
          ? {
              ...clinic,
              sessions: clinic.sessions.filter((session) => session.id !== sessionId)
            }
          : clinic
      )
    );
  }

  function save() {
    setMessage("");
    startTransition(async () => {
      try {
        await saveClinicList(clinics);
        setMessage("Saved. The public Clinics section is updated.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not save clinics.");
      }
    });
  }

  function uploadImage(clinicId: string, file: File | null) {
    if (!file) {
      return;
    }

    setMessage("Uploading image...");
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const imageUrl = await uploadClinicImage(formData);
        updateClinic(clinicId, { imageUrl });
        setMessage("Image uploaded. Save changes to publish it.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not upload image.");
      }
    });
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <a href="/">← Back to site</a>
            <h1>Clinics</h1>
          </div>
          <button onClick={save} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </header>

        {clinics.map((clinic, clinicIndex) => (
          <section className="admin-card" key={clinic.id}>
            <div className="admin-card__title">
              <h2>{clinic.title || `Clinic ${clinicIndex + 1}`}</h2>
              <button className="button-ghost" onClick={() => removeClinic(clinic.id)} type="button">
                Remove clinic
              </button>
            </div>

            <div className="field-row">
              <label>
                <span>Clinic title</span>
                <input value={clinic.title} onChange={(event) => updateClinic(clinic.id, { title: event.target.value })} />
              </label>
              <label>
                <span>Upload image</span>
                <input accept="image/*" onChange={(event) => uploadImage(clinic.id, event.target.files?.[0] || null)} type="file" />
              </label>
            </div>

            {clinic.imageUrl ? (
              <div className="admin-preview">
                <img src={clinic.imageUrl} alt="" />
                <span>Current image</span>
              </div>
            ) : null}

            <div className="session-list">
              {clinic.sessions.map((session, sessionIndex) => (
                <section className="session-card" key={session.id}>
                  <div className="session-card__top">
                    <h3>Location {sessionIndex + 1}</h3>
                    {clinic.sessions.length > 1 ? (
                      <button className="button-ghost" onClick={() => removeSession(clinic.id, session.id)} type="button">
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <label>
                    <span>Date</span>
                    <input value={session.date} onChange={(event) => updateSession(clinic.id, session.id, { date: event.target.value })} />
                  </label>
                  <label>
                    <span>Location</span>
                    <input value={session.location} onChange={(event) => updateSession(clinic.id, session.id, { location: event.target.value })} />
                  </label>
                  <label>
                    <span>URL</span>
                    <input value={session.url} onChange={(event) => updateSession(clinic.id, session.id, { url: event.target.value })} />
                  </label>
                </section>
              ))}
            </div>

            <div className="admin-actions">
              <button onClick={() => addSession(clinic.id)} type="button">
                + Add clinic location
              </button>
            </div>
          </section>
        ))}

        <div className="admin-actions">
          <button onClick={addClinic} type="button">
            + Add new clinic
          </button>
        </div>

        {message ? <p className="admin-message">{message}</p> : null}
      </div>
    </div>
  );
}
