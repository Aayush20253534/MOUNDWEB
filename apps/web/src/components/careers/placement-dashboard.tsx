"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, ChartColumn, ShieldCheck } from "lucide-react";
import { metricDefinitions, placementReports, isVerifiedReport } from "@/lib/placements";

const tracks = ["All tracks", "Digital Marketing", "Web Development"] as const;

export function PlacementDashboard() {
  const [track, setTrack] = useState<(typeof tracks)[number]>("All tracks");
  const [metric, setMetric] = useState(metricDefinitions[0]!.key);
  const verified = useMemo(() => placementReports.filter(isVerifiedReport), []);
  const scoped = verified.filter((entry) => track === "All tracks" || entry.track === track);
  const selected = metricDefinitions.find((item) => item.key === metric)!;
  const indicators = [
    { icon: BookOpenCheck, title: "Enrollment and participation", text: "Record who joined a program, not who merely inquired." },
    { icon: ShieldCheck, title: "Documented completion", text: "Use an agreed training and assessment standard." },
    { icon: BadgeCheck, title: "Career outcome verification", text: "Distinguish assistance, interviews, offers and confirmed employment." },
  ];

  return (
    <div className="placement-dashboard">
      <div className="placement-overview">
        <div>
          <span className="eyebrow">Transparent reporting</span>
          <h2>Progress with <em>proof.</em></h2>
          <p className="body-copy">Verified, consent-reviewed reports will appear here with their period, source and definitions. No placement percentage or employment outcome is being advertised.</p>
        </div>
        <div className="placement-verification-status">
          <ShieldCheck size={22} aria-hidden="true" />
          <span>Verified reports</span>
          <strong>{verified.length}</strong>
          <small>{verified.length === 0 ? "Reporting pending" : "Verified records available"}</small>
        </div>
      </div>
      <div className="placement-toolbar">
        <label htmlFor="placement-track">Training track</label>
        <select id="placement-track" value={track}
          onChange={(event) => setTrack(event.target.value as (typeof tracks)[number])}>
          {tracks.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <span role="status" aria-live="polite">{scoped.length} verified {scoped.length === 1 ? "report" : "reports"} for this selection</span>
      </div>
      {scoped.length > 0 ? (
        <div className="placement-reports">
          {scoped.map((report) => (
            <article className="placement-report" key={report.id}>
              <h3>{report.track}</h3>
              <p>{report.periodStart} to {report.periodEnd}</p>
              <p className="placement-report-source">Source: {report.sourceDescription}</p>
              <dl>{metricDefinitions.map((entry) =>
                <div key={entry.key}><dt>{entry.label}</dt><dd>{report.figures[entry.key].toLocaleString("en-IN")}</dd></div>)}</dl>
            </article>
          ))}
        </div>
      ) : (
        <div className="placement-no-data">
          <ChartColumn size={31} aria-hidden="true" />
          <div>
            <h3>No verified reports have been published.</h3>
            <p>Reporting periods, cohort definitions, learner consent and outcome documentation must be reviewed before metrics become visible. Blank values are intentional; zero would imply a measured result.</p>
          </div>
        </div>
      )}
      <div className="placement-methodology">
        <div className="placement-methodology-heading">
          <span className="eyebrow">Measurement methodology</span>
          <h3>What does each <em>term mean?</em></h3>
          <p>Choose a metric to see what it can and cannot demonstrate.</p>
        </div>
        <div className="placement-definition-tabs" role="group" aria-label="Reporting metric definitions">
          {metricDefinitions.map((item) => <button type="button" key={item.key}
            aria-pressed={metric === item.key}
            className={"placement-definition-tab" + (metric === item.key ? " placement-definition-tab--active" : "")}
            onClick={() => setMetric(item.key)}>{item.label}</button>)}
        </div>
        <article className="placement-definition-card" aria-live="polite">
          <h4>{selected.title}</h4>
          <p>{selected.definition}</p>
          <strong>Not included</strong>
          <p>{selected.excluded}</p>
        </article>
      </div>
      <div className="placement-pathway-cards">
        {indicators.map(({ icon: Icon, title, text }) =>
          <article key={title}><Icon size={24} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>
        )}
      </div>
      <div className="placement-explore-link">
        <p>Interested in actual learning pathways? Program details are separate from placement outcomes.</p>
        <Link href="/programs" className="text-link">Explore learning programs <ArrowRight size={16} aria-hidden="true"/></Link>
      </div>
    </div>
  );
}
