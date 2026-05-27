import { getRegistrations } from "@/lib/registrations";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function RegistrationsPage() {
  const registrations = await getRegistrations();

  return (
    <div className="admin-page">
      <div className="admin-shell admin-shell--wide">
        <header className="admin-header">
          <div>
            <a href="/">← Back to site</a>
            <h1>Registrations</h1>
            <nav className="admin-nav">
              <a href="/admin">Clinics</a>
              <a href="/admin/registrations">Registrations</a>
            </nav>
          </div>
        </header>

        {registrations.length === 0 ? (
          <section className="admin-card">
            <p className="empty-state">No registrations yet.</p>
          </section>
        ) : (
          <div className="registrations-list">
            {registrations.map((registration) => (
              <article className="registration-card" key={registration.id}>
                <div className="registration-card__top">
                  <div>
                    <h2>{registration.name}</h2>
                    <p>{formatDate(registration.createdAt)}</p>
                  </div>
                  <a href={`mailto:${registration.email}`}>{registration.email}</a>
                </div>

                <dl>
                  <dt>Clinic</dt>
                  <dd>{registration.clinicTitle}</dd>
                  <dt>Date</dt>
                  <dd>{registration.sessionDate}</dd>
                  <dt>Location</dt>
                  <dd>{registration.sessionLocation}</dd>
                  <dt>Phone / WhatsApp</dt>
                  <dd>{registration.phone}</dd>
                  <dt>Country</dt>
                  <dd>{registration.country || "-"}</dd>
                  <dt>Sailing level</dt>
                  <dd>{registration.sailingLevel || "-"}</dd>
                  <dt>Message</dt>
                  <dd>{registration.message || "-"}</dd>
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
