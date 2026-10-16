"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
import { serviceGoals, getServiceGuide } from "@/lib/service-guides";

/** Lightweight choice tool, not a claim of personalized professional advice. */
export function ServiceExplorer() {
  const [choice, setChoice] = useState<(typeof serviceGoals)[number]["slug"]>("seo");
  const goal = serviceGoals.find((item) => item.slug === choice)!;
  const service = services.find((item) => item.slug === choice)!;
  const guide = getServiceGuide(service);
  return (
    <div className="service-explorer">
      <div className="service-explorer-intro">
        <p className="eyebrow">Explore a direction</p>
        <h2>What matters <em>to your brand?</em></h2>
        <p className="body-copy">Choose one priority to explore a related marketing service. This is a starting point, not a performance promise.</p>
      </div>
      <div className="service-explorer-layout">
        <div className="service-goal-list" role="group" aria-label="Marketing goals">
          {serviceGoals.map((item, index) => (
            <button
              type="button"
              className={"service-goal" + (item.slug === choice ? " service-goal--active" : "")}
              key={item.slug}
              aria-pressed={item.slug === choice}
              onClick={() => setChoice(item.slug)}
            >
              <span className="service-goal-index">0{index + 1}</span>
              <span><strong>{item.label}</strong><small>{item.description}</small></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="service-recommendation" aria-live="polite" aria-atomic="true">
          <span className="service-recommendation-label">Related service</span>
          <h3>{service.title}</h3>
          <p>{guide.positioning}</p>
          <div className="service-recommendation-question">
            <span>Start with this question</span>
            <strong>{guide.clientQuestion}</strong>
          </div>
          <div className="service-recommendation-links">
            <Link className="button button--primary" href={"/services/" + service.slug}>
              Explore this service <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="text-link" href={"/contact?type=growth&subject=" +
              encodeURIComponent(service.title) + "#inquiry"}>
              Discuss with us <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <span className="service-recommendation-footnote">Selected goal: {goal.label}</span>
        </div>
      </div>
    </div>
  );
}
