"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Search, X } from "lucide-react";
import { careerDepartments, isOpenRole, jobListings } from "@/lib/careers";

export function CareerExplorer() {
  const [selected, setSelected] = useState("All areas");
  const [query, setQuery] = useState("");
  const available = jobListings.filter(isOpenRole);
  const relevant = useMemo(() => available.filter((role) =>
    (selected === "All areas" || role.department === selected) &&
    (!query.trim() || [role.title, role.description, role.department, role.location]
      .join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  ), [available, selected, query]);
  const domains = careerDepartments.filter((item) =>
    (selected === "All areas" || item.name === selected) &&
    (!query.trim() || [item.name, item.description, ...item.focus].join(" ")
      .toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  );
  return (
    <div className="career-discovery">
      <div className="career-discovery-heading">
        <div>
          <span className="eyebrow">Career discovery</span>
          <h2>Find your <em>direction.</em></h2>
          <p className="body-copy">Explore areas of work. These are themes, not advertised positions or invitations to apply.</p>
        </div>
        <span className="career-open-count"><BriefcaseBusiness size={17} aria-hidden="true" /> {available.length} verified open {available.length === 1 ? "role" : "roles"}</span>
      </div>
      <div className="career-filter-bar">
        <div className="career-filter-categories" role="group" aria-label="Areas of work">
          {["All areas", ...careerDepartments.map((item) => item.name)].map((item) =>
            <button type="button" key={item} aria-pressed={selected === item}
              className={"career-filter-chip" + (selected === item ? " career-filter-chip--active" : "")}
              onClick={() => setSelected(item)}>{item}</button>)}
        </div>
        <label className="career-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search work areas</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills and interests" autoComplete="off" />
        </label>
        <p className="career-results" aria-live="polite">{domains.length} interest {domains.length === 1 ? "area" : "areas"} matching</p>
      </div>
      {available.length === 0 && (
        <div className="career-no-roles" role="status">
          <strong>There are no confirmed open vacancies right now.</strong>
          <p>We will publish openings only after positions, requirements, location, work arrangement and an application channel have been verified. No applications are being collected here.</p>
        </div>
      )}
      {relevant.length > 0 && (
        <div className="career-verified-roles" aria-label="Verified job openings">
          {relevant.map((role) => (
            <article className="career-verified-role" key={role.slug}>
              <div><span className="eyebrow">{role.department} · {role.employmentType}</span><h3>{role.title}</h3>
                <p>{role.location} · {role.arrangement}</p></div>
              <a className="button button--primary" href={role.applicationUrl!}
                rel="noopener noreferrer" target="_blank">View verified role <ArrowRight size={16} aria-hidden="true"/></a>
            </article>
          ))}
        </div>
      )}
      {domains.length ? (
        <div className="career-domain-grid">
          {domains.map((domain, index) => (
            <article className="career-domain-card" key={domain.name}>
              <span className="career-domain-index">0{index + 1}</span>
              <span className="career-domain-kicker">Area of interest · Not a vacancy</span>
              <h3>{domain.name}</h3>
              <strong>{domain.tagline}</strong>
              <p>{domain.description}</p>
              <ul>{domain.focus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
              <Link href={"/contact?type=career&subject=" + encodeURIComponent(domain.name + " — general career question") + "#inquiry"}
                className="text-link">Prepare a general question <ArrowRight size={16} aria-hidden="true"/></Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="career-filter-empty" role="status">
          <h3>No matching areas</h3>
          <p>Try another topic or reset your filters.</p>
          <button type="button" className="button button--secondary"
            onClick={() => { setQuery(""); setSelected("All areas"); }}>
            <X size={16} aria-hidden="true"/> Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
