"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { courses } from "@/lib/content";
import { courseLevels, getGuide } from "@/lib/course-guides";
import { CourseCard } from "@/components/ui/cards";
import { IconTile, Eyebrow, Badge } from "@/components/ui/primitives";

type Category = "All paths" | "Digital Marketing" | "Web Development";
type Level = "All levels" | (typeof courseLevels)[number];

export function ProgramCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All paths");
  const [level, setLevel] = useState<Level>("All levels");

  const visible = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return courses.filter((course) => {
      const guide = getGuide(course);
      return (category === "All paths" || course.category === category) &&
        (level === "All levels" || guide.level === level) &&
        (!search || [course.title, course.category, course.summary, ...course.focus,
          ...guide.modules.map((m) => m.title)].join(" ").toLocaleLowerCase().includes(search));
    });
  }, [category, level, query]);
  const reset = () => { setQuery(""); setCategory("All paths"); setLevel("All levels"); };
  return (
    <>
      <div className="catalog-controls" aria-label="Find a program">
        <div className="catalog-path-filters" role="group" aria-label="Learning path">
          {(["All paths", "Digital Marketing", "Web Development"] as const).map((item) =>
            <button key={item} type="button" onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={"catalog-filter" + (category === item ? " catalog-filter--active" : "")}>
              {item}
            </button>
          )}
        </div>
        <div className="catalog-search-row">
          <label className="catalog-search" htmlFor="program-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search courses</span>
            <input id="program-search" type="search" value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses and skills…" autoComplete="off" />
          </label>
          <label className="catalog-level">
            <span>Experience</span>
            <select aria-label="Experience level" value={level}
              onChange={(event) => setLevel(event.target.value as Level)}>
              <option value="All levels">All levels</option>
              {courseLevels.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <button type="button" className="catalog-reset" onClick={reset}>
            <X size={15} aria-hidden="true" /> Clear filters
          </button>
        </div>
        <p aria-live="polite" aria-atomic="true" className="catalog-result-count">
          {visible.length} {visible.length === 1 ? "program" : "programs"} matching your search
        </p>
      </div>
      {(["Digital Marketing", "Web Development"] as const).map((track) => {
        const selection = visible.filter((course) => course.category === track);
        if (selection.length === 0) return null;
        return (
          <div className="program-group" id={track === "Digital Marketing" ? "digital-marketing" : "web-development"} key={track}>
            <div className="program-group-header">
              <IconTile name={track === "Digital Marketing" ? "chart" : "code"} />
              <div>
                <Eyebrow>{track === "Digital Marketing" ? "Strategy, creativity and AI tools" : "Interfaces, data and applications"}</Eyebrow>
                <h2>{track} programs</h2>
                <p>{track === "Digital Marketing"
                  ? "AI Special, AI Master, AI Professional, AI Digi Hero and AI Digital Ninja are within this learning path."
                  : "Learn web development from fundamentals through full-stack and responsible AI-assisted practice."}</p>
              </div>
              <Badge>{selection.length} {selection.length === 1 ? "course" : "courses"}</Badge>
            </div>
            <div className="card-grid course-grid">
              {selection.map((course) => <CourseCard course={course} key={course.slug} />)}
            </div>
          </div>
        );
      })}
      {visible.length === 0 && (
        <div className="catalog-empty" role="status">
          <h3>No matching programs</h3>
          <p>Try another skill, learning path or experience level.</p>
          <button className="button button--secondary" type="button" onClick={reset}>Show all programs</button>
        </div>
      )}
    </>
  );
}
