import { getClinics } from "@/lib/clinics";
import { SiteHeader } from "./site-header";
import { TelemetryHud } from "./telemetry-hud";

const assets = {
  hero: "/images/hero.jpg",
  split: "/images/location-split.png",
  garda: "/images/location-campione.png",
  lanzarote: "/images/location-marina.png",
  whatsapp: "/images/whatsapp.png"
};

const clinicBenefits = [
  {
    icon: "/icons/onboard-demonstration.svg",
    title: "On-Board Demonstration:",
    text: "On-board sessions demonstrate the exact body mechanics, trim, and feel required for peak performance."
  },
  {
    icon: "/icons/technical-mastery.svg",
    title: "Highly tactical:",
    text: "We integrate GPS and video to turn every run into practical, race-ready feedback."
  },
  {
    icon: "/icons/individual-calibration.svg",
    title: "Individual calibration:",
    text: "Personalized feedback that is impossible to achieve in large fleets."
  }
];

const eliteBenefits = [
  {
    icon: "/icons/zero-noise.svg",
    title: "Zero Noise:",
    text: "Every drill is focused on one clear performance signal."
  },
  {
    icon: "/icons/smooth-power.svg",
    title: "Smooth Power:",
    text: "We find the hidden brakes in your technique and replace them with efficient movement."
  },
  {
    icon: "/icons/high-intensity-learning.svg",
    title: "High-Intensity Learning:",
    text: "Spend less time waiting and more time learning."
  }
];

const locations = [
  {
    image: assets.split,
    title: "Split, Croatia // The Adriatic Tactical Lab",
    body: "Located at the foot of Mount Marjan, Split provides a dynamic sailing arena protected by the Dalmatian islands.",
    dynamics: "The Mistral provides a stable afternoon breeze, while the Bura offers high-intensity, gusty conditions for flat-water speed work.",
    value: "Ideal for maneuver precision and understanding current flows within channel systems."
  },
  {
    image: assets.garda,
    title: "Campione del Garda, Italy // The Thermal Stadium",
    body: "Tucked beneath vertical cliffs on Lake Garda's western shore, Campione is a natural wind tunnel.",
    dynamics: "The Peler dominates the morning with heavy pressure, transitioning to the Ora in the afternoon.",
    value: "The most consistent thermal venue in the world. Perfect for repetitive high-speed drills."
  },
  {
    image: assets.lanzarote,
    title: "Marina Rubicon, Lanzarote // The Oceanic Grind",
    body: "Positioned on the southern tip of Lanzarote, this hub offers full Atlantic exposure with subtropical stability.",
    dynamics: "Strong NE trade winds push against significant oceanic swell.",
    value: "The ultimate test for big-wave technique and open-ocean stamina."
  }
];

export default async function Home() {
  const clinics = await getClinics();

  return (
    <main>
      <section className="hero" id="home">
        <img src={assets.hero} alt="" className="hero__image" />
        <div className="hero__overlay" />
        <SiteHeader />
        <div className="container hero__content">
          <h1>
            Stop guessing
            <br />
            Start winning
          </h1>
        </div>
      </section>

      <section className="whatsapp container" data-reveal>
        <img className="whatsapp__qr" src={assets.whatsapp} alt="" />
        <p>
          Join our <a href="https://chat.whatsapp.com/KAP1NAKWxXR1Tt0K3sttH2?mode=gi_t" rel="noreferrer" target="_blank">whatsapp group</a>
        </p>
      </section>

      <section className="about container" id="about" data-reveal>
        <div className="section-heading" data-reveal>
          <h2>About us</h2>
          <div className="rich-copy">
            <p>
              <strong>Elite coaching is a science, not a secret.</strong>
            </p>
            <p>We believe that at the highest level of competition, success is what happens when preparation meets opportunity.</p>
            <p>An athlete's most valuable asset is time. Treasure it and use it with maximum efficiency.</p>
            <p>
              <strong>Prepare today so you don't miss your chance to stand on the podium tomorrow.</strong>
            </p>
          </div>
        </div>
      </section>

      <TelemetryHud />

      <section className="clinic-intro container" id="clinics" data-reveal>
        <div className="section-heading" data-reveal>
          <h2>Our clinics</h2>
        </div>
        <div className="benefits">
          {clinicBenefits.map((benefit) => (
            <article key={benefit.title} data-reveal>
              <span className="icon-square">
                <img src={benefit.icon} alt="" />
              </span>
              <p>
                <strong>{benefit.title}</strong>
                <br />
                {benefit.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="clinic-list" data-reveal>
        <div className="container clinic-list__inner">
          {clinics.map((clinic) => (
            <article className="clinic-card" key={clinic.id} data-reveal>
              <div>
                <h2>{clinic.title}</h2>
                <ul>
                  {clinic.sessions.map((session) => (
                    <li key={session.id}>
                      <strong>{session.date}</strong>
                      <span>{session.location}</span>
                      <a href={`/clinics/${clinic.id}/${session.id}`}>More info</a>
                    </li>
                  ))}
                </ul>
              </div>
              {clinic.imageUrl ? <img src={clinic.imageUrl} alt="" /> : <div className="clinic-card__placeholder" />}
            </article>
          ))}
        </div>
      </section>

      <section className="elite container" data-reveal>
        <div data-reveal>
          <h2>Elite coaching requires absolute focus</h2>
        </div>
        <div data-reveal>
          <p>
            Because boat speed is fundamental, we limit our group sizes to maintain a personalized approach. This means sailors quickly grasp the principles of why understanding wind, waves and boat speed techniques allow you to apply your techniques and master the variables of the race.
          </p>
          {eliteBenefits.map((benefit) => (
            <article key={benefit.title} data-reveal>
              <span className="icon-square">
                <img src={benefit.icon} alt="" />
              </span>
              <p>
                <strong>{benefit.title}</strong>
                <br />
                {benefit.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="locations" id="locations" data-reveal>
        <div className="container">
          <h2 data-reveal>Locations</h2>
          <div className="location-list">
            {locations.map((location) => (
              <article className="location" key={location.title} data-reveal>
                <div>
                  <img src={location.image} alt="" />
                </div>
                <section>
                  <h3>{location.title}</h3>
                  <p>{location.body}</p>
                  <p>
                    <strong>Primary dynamics:</strong> {location.dynamics}
                  </p>
                  <p>
                    <strong>Strategic value:</strong> {location.value}
                  </p>
                </section>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <p>© Velumrace 2025</p>
          <div aria-label="Social links">
            <a href="https://facebook.com/Velumrace" aria-label="Facebook" rel="noreferrer" target="_blank">
              <img src="/icons/facebook.svg" alt="" />
            </a>
            <a href="https://www.instagram.com/velumrace" aria-label="Instagram" rel="noreferrer" target="_blank">
              <img src="/icons/instaagram.svg" alt="" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
