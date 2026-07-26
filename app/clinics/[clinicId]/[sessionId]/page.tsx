import { notFound } from "next/navigation";
import { getClinicSession } from "@/lib/clinics";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { RegistrationForm } from "./registration-form";

type ClinicDetailsPageProps = {
  params: Promise<{
    clinicId: string;
    sessionId: string;
  }>;
};

export default async function ClinicDetailsPage({ params }: ClinicDetailsPageProps) {
  const { clinicId, sessionId } = await params;
  const details = await getClinicSession(clinicId, sessionId);

  if (!details) {
    notFound();
  }

  const { clinic, session } = details;

  return (
    <main>
      <section className="clinic-detail-hero">
        <SiteHeader />
        {clinic.imageUrl ? <img src={clinic.imageUrl} alt="" /> : null}
        <div className="clinic-detail-hero__overlay" />
        <div className="container clinic-detail-hero__content">
          <a href="/#clinics">Back to clinics</a>
          <h1>{clinic.title}</h1>
          <p>{session.date}</p>
          <p>{session.location}</p>
        </div>
      </section>

      <section className="clinic-detail container">
        <div className="clinic-detail__summary" data-reveal>
          <h2>Clinic details</h2>
          <dl>
            <dt>Clinic</dt>
            <dd>{clinic.title}</dd>
            <dt>Date</dt>
            <dd>{session.date}</dd>
            <dt>Location</dt>
            <dd>{session.location}</dd>
          </dl>
        </div>

        <div className="clinic-detail__copy" data-reveal>
          <p>
            This clinic is designed for sailors who want focused technical feedback, stronger race decisions and clearer boat-speed habits. The program combines on-water observation, practical drills and individual calibration so every session has a measurable purpose.
          </p>
          <p>
            Submit the form below and the team will follow up with availability, logistics and next steps for this specific clinic date.
          </p>
        </div>
      </section>

      <section className="registration-section container" data-reveal>
        <div>
          <h2>Registration</h2>
          <p>
            Request a place for {clinic.title}, {session.date}.
          </p>
        </div>
        <RegistrationForm clinicId={clinic.id} sessionId={session.id} />
      </section>
      <SiteFooter />
    </main>
  );
}
