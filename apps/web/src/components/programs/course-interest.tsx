"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/lib/content";

/** Frontend-only guidance builder; no application is submitted or saved. */
export function CourseInterest({ course }: { course: Course }) {
  const [background, setBackground] = useState("New to this subject");
  const [goal, setGoal] = useState("Understand the course and requirements");
  const description = [
    "I would like information about " + course.title + " (" + course.category + ").",
    "Background: " + background + ".",
    "I want to: " + goal + ".",
    "Please share the approved curriculum, eligibility, delivery mode, schedule, fees and enrollment process.",
  ].join("\n");
  const destination = "/contact?type=course&subject=" +
    encodeURIComponent(course.title) + "&message=" + encodeURIComponent(description) + "#inquiry";
  return (
    <div className="course-interest" id="request-program-info">
      <p className="eyebrow">Plan your inquiry</p>
      <h3>Find your starting point.</h3>
      <p className="body-copy">Choose what you would like guidance on. Your selections will prefill a review-only inquiry on the Contact page.</p>
      <label htmlFor="program-background">Your experience</label>
      <select id="program-background" value={background} onChange={(event) => setBackground(event.target.value)}>
        <option>New to this subject</option>
        <option>Some prior experience</option>
        <option>Already working or studying in this field</option>
        <option>Parent or guardian asking for a learner</option>
      </select>
      <label htmlFor="program-goal">What would help most?</label>
      <select id="program-goal" value={goal} onChange={(event) => setGoal(event.target.value)}>
        <option>Understand the course and requirements</option>
        <option>Compare this with another learning track</option>
        <option>Ask about eligibility, fees and dates</option>
        <option>Explore practical projects and curriculum</option>
      </select>
      <Link className="button button--primary" href={destination}>
        Prepare program inquiry <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <p className="micro-note">No application, payment, seat reservation, or submission occurs here. The Contact form is currently a local preview; message delivery will be enabled with the backend in Part 11.</p>
    </div>
  );
}
