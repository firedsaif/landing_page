import styles from "./page.module.css";
import Certificate from "@/components/Certificate";
import WaitlistForm from "@/components/WaitlistForm";
import Reveal from "@/components/Reveal";
import SiteAnimator from "@/components/SiteAnimator";
import {
  IconClock,
  IconAlert,
  IconRenew,
  IconBolt,
  IconSelfServe,
  IconArrow,
  IconLock,
  IconShield,
  IconUser,
  IconCheck,
} from "@/components/icons";

const PAINS = [
  {
    Icon: IconClock,
    label: "Wasted hours",
    title: "Certificates eat the whole afternoon",
    body: "Account managers retype the same ACORD 25 over and over, then chase a signature and a PDF. Multiply that by every client, every job site.",
  },
  {
    Icon: IconAlert,
    label: "Costly errors",
    title: "One wrong line and the job stops",
    body: "Miss an additional-insured endorsement or fat-finger a limit, and a client gets turned away at the gate — or worse, you’re on the hook for the gap.",
  },
  {
    Icon: IconRenew,
    label: "Renewal chaos",
    title: "Renewals reset the clock every year",
    body: "New policy numbers and dates mean re-issuing every certificate by hand — a quiet flood of work nobody scheduled and nobody enjoys.",
  },
];

const STEPS = [
  {
    Icon: IconSelfServe,
    title: "Your client requests it themselves",
    body: "They pick the holder and project from a link you control. No email to your team, no waiting on a callback.",
  },
  {
    Icon: IconBolt,
    title: "The right wording fills in automatically",
    body: "CertFlow pulls the policy data and inserts the correct additional-insured endorsements and limits — exactly as your carrier requires.",
  },
  {
    Icon: IconRenew,
    title: "It re-issues itself at renewal",
    body: "When the policy renews, every active certificate updates with the new dates and numbers. No annual re-typing marathon.",
  },
];

const OUTCOMES = [
  { num: "9 sec", label: "from request to issued certificate" },
  { num: "6+ hrs", label: "of manual COI work saved per week, per AM" },
  { num: "0", label: "endorsements missed — wording is automatic" },
  { num: "24/7", label: "client self-serve, even when you’re closed" },
];

const TRUST = [
  {
    Icon: IconShield,
    title: "Your wording, your carriers",
    body: "Endorsement language and limits follow your agency’s rules and the carrier forms you already use — not a generic template.",
  },
  {
    Icon: IconLock,
    title: "Built for a book of record",
    body: "Every certificate is logged with who issued it, to whom, and when. When a holder asks, the answer is one search away.",
  },
  {
    Icon: IconUser,
    title: "Made for small independents",
    body: "No enterprise rollout, no IT project. Designed for two-to-twenty-person P&C shops that just need the certificates handled.",
  },
];

export default function Home() {
  return (
    <SiteAnimator>
      <header className={styles.header} data-site-header>
        <div className={`wrap ${styles.headerInner}`}>
          <a href="#top" className={styles.brand} aria-label="CertFlow home">
            <span className={styles.brandMark} aria-hidden="true">
              <IconCheck width={16} height={16} />
            </span>
            CertFlow
          </a>
          <nav className={styles.nav} aria-label="Primary">
            <a href="#pain">The problem</a>
            <a href="#how">How it works</a>
            <a href="#proof">What changes</a>
            <a href="#built">Built for agencies</a>
          </nav>
          <a href="#join" className={`btn btn-ghost ${styles.headerCta}`}>
            Join the waitlist
          </a>
        </div>
      </header>

      <main id="top">
        {/* ---------------- HERO ---------------- */}
        <section className={styles.hero}>
          <div className={`wrap ${styles.heroGrid}`}>
            <div className={styles.heroCopy} data-hero>
              <span className="eyebrow is-blue">For independent P&amp;C agencies</span>
              <h1 className={`h-display ${styles.h1}`}>
                Stop typing certificates of insurance by hand.
              </h1>
              <p className="lead">
                CertFlow lets your clients self-serve their COIs in seconds. The
                correct additional-insured wording fills in automatically, and every
                certificate re-issues itself at renewal — so your account managers
                stop retyping ACORD forms all day.
              </p>
              <div className={styles.heroForm}>
                <WaitlistForm source="hero" cta="Get early access" />
              </div>
              <ul className={styles.heroProof}>
                <li>
                  <IconCheck width={17} height={17} /> Free during early access
                </li>
                <li>
                  <IconCheck width={17} height={17} /> Keep your carriers &amp; wording
                </li>
                <li>
                  <IconCheck width={17} height={17} /> No setup project
                </li>
              </ul>
            </div>

            <div className={styles.heroArt} data-hero-art>
              <Certificate />
            </div>
          </div>
        </section>

        {/* ---------------- PAIN ---------------- */}
        <section id="pain" className="section">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow is-brick">The cost of doing it by hand</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className={`h-section ${styles.sectionHead}`}>
                Certificates are small documents with big consequences.
              </h2>
            </Reveal>
            <div className={styles.painGrid}>
              {PAINS.map((p, i) => (
                <Reveal key={p.label} index={i}>
                  <article className={`fieldbox ${styles.painCard}`}>
                    <span className={styles.painIcon} aria-hidden="true">
                      <p.Icon width={22} height={22} />
                    </span>
                    <span className="field-label">{p.label}</span>
                    <h3 className={styles.painTitle}>{p.title}</h3>
                    <p className={styles.cardBody}>{p.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section id="how" className={`section ${styles.howSection}`}>
          <div className="wrap">
            <Reveal>
              <span className="eyebrow is-blue">How it works</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className={`h-section ${styles.sectionHead}`}>
                Three steps replace an afternoon of typing.
              </h2>
            </Reveal>
            <ol className={styles.steps}>
              {STEPS.map((s, i) => (
                <Reveal key={s.title} index={i}>
                  <li className={styles.step}>
                    <div className={styles.stepNum}>
                      <span className="mono">0{i + 1}</span>
                      {i < STEPS.length - 1 && <span className={styles.stepLine} />}
                    </div>
                    <div className={styles.stepBody}>
                      <span className={styles.stepIcon} aria-hidden="true">
                        <s.Icon width={22} height={22} />
                      </span>
                      <h3 className={styles.stepTitle}>{s.title}</h3>
                      <p className={styles.cardBody}>{s.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- OUTCOMES ---------------- */}
        <section id="proof" className="section">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow is-green">What changes day one</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className={`h-section ${styles.sectionHead}`}>
                The afternoon you get back.
              </h2>
            </Reveal>
            <div className={styles.statBand}>
              {OUTCOMES.map((o, i) => (
                <Reveal key={o.label} index={i}>
                  <div className={styles.stat}>
                    <div
                      className={`mono ${styles.statNum}`}
                      data-stat-num
                      data-full={o.num}
                    >
                      {o.num}
                    </div>
                    <div className={styles.statLabel}>{o.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <p className={styles.statNote}>
                {/* EDIT: replace with your own measured figures before launch. */}
                Illustrative figures based on typical small-agency certificate volume.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- TRUST ---------------- */}
        <section id="built" className={`section ${styles.trustSection}`}>
          <div className="wrap">
            <Reveal>
              <span className="eyebrow">Built for how agencies actually work</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className={`h-section ${styles.sectionHead}`}>
                It fits your shop — not the other way around.
              </h2>
            </Reveal>
            <div className={styles.trustGrid}>
              {TRUST.map((t, i) => (
                <Reveal key={t.title} index={i}>
                  <article className={styles.trustCard}>
                    <span className={styles.trustIcon} aria-hidden="true">
                      <t.Icon width={22} height={22} />
                    </span>
                    <h3 className={styles.trustTitle}>{t.title}</h3>
                    <p className={styles.cardBody}>{t.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section id="join" className={styles.cta}>
          <div className={`wrap ${styles.ctaInner}`}>
            <Reveal>
              <span className={`eyebrow ${styles.ctaEyebrow}`}>Early access</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className={styles.ctaHead}>
                Get your account managers out of the certificate business.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={styles.ctaLead}>
                We’re onboarding a first group of independent agencies. Add your email
                and we’ll reach out when your spot opens.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className={styles.ctaForm}>
                <WaitlistForm variant="dark" source="footer-cta" cta="Join the waitlist" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`wrap ${styles.footerInner}`}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              <IconCheck width={16} height={16} />
            </span>
            CertFlow
          </div>
          <p className={styles.footerNote}>
            Certificates of insurance, issued in seconds. For US independent P&amp;C
            agencies.
          </p>
          <a href="#join" className={styles.footerLink}>
            Join the waitlist <IconArrow width={16} height={16} />
          </a>
        </div>
        <div className={`wrap ${styles.footerBottom}`}>
          <span>© {new Date().getFullYear()} CertFlow</span>
          <span className="mono">Not affiliated with ACORD.</span>
        </div>
      </footer>
    </SiteAnimator>
  );
}
