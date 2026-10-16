"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import {
  episodes, episodeCategories, mediaCategories, mediaItems, isPublishedEpisode, isPublishedMedia,
} from "@/lib/editorial";

type Kind = "podcast" | "media";

export function EditorialCatalog({ kind }: { kind: Kind }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All " + (kind === "podcast" ? "topics" : "formats"));
  const items = kind === "podcast" ? episodes : mediaItems;
  const categories = kind === "podcast" ? episodeCategories : mediaCategories;
  const published = items.filter((item) =>
    kind === "podcast" ? isPublishedEpisode(item as (typeof episodes)[number]) : isPublishedMedia(item as (typeof mediaItems)[number])
  );
  const draft = items.filter((item) => !published.some((live) => live.slug === item.slug));
  const search = query.trim().toLocaleLowerCase();
  const visible = useMemo(() => draft.filter((item) =>
    (category.startsWith("All ") || item.category === category) &&
    (!search || [item.title, item.summary, item.category].join(" ").toLocaleLowerCase().includes(search))
  ), [draft, category, search]);
  function reset() { setQuery(""); setCategory(categories[0]); }

  return (
    <div className={"editorial-catalog editorial-catalog--" + kind}>
      {published.length === 0 && (
        <div className="editorial-empty-live">
          <strong>{kind === "podcast" ? "No published episodes yet" : "No published media releases yet"}</strong>
          <p>{kind === "podcast"
            ? "Verified recordings, episode dates, credits and accessible transcripts will appear here after publication."
            : "Approved features, galleries and dated updates will be listed here when published."}</p>
        </div>
      )}
      <div className="editorial-catalog-heading">
        <div>
          <span className="eyebrow">Editorial planning board</span>
          <h2>Ideas on the <em>horizon.</em></h2>
          <p className="body-copy">Clearly labeled, unpublished concepts showing how the future {kind === "podcast" ? "podcast" : "media"} experience will work.</p>
        </div>
        <span className="editorial-catalog-count">Draft concepts: {draft.length}</span>
      </div>
      <div className="editorial-filters">
        <div className="editorial-filter-chips" role="group" aria-label={kind === "podcast" ? "Podcast topics" : "Media categories"}>
          {categories.map((item) =>
            <button key={item} type="button" className={"editorial-chip" + (category === item ? " editorial-chip--selected" : "")}
              aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <label className="editorial-search" htmlFor={"editorial-search-" + kind}>
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search {kind === "podcast" ? "podcast concepts" : "media concepts"}</span>
          <input id={"editorial-search-" + kind} type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles and themes" autoComplete="off" />
        </label>
        <p className="editorial-match-count" aria-live="polite">{visible.length} matching draft {visible.length === 1 ? "concept" : "concepts"}</p>
      </div>
      {visible.length > 0 ? (
        <div className="editorial-card-grid">
          {visible.map((item, index) => (
            <article className="editorial-card" key={item.slug}>
              <Link href={"/" + kind + "/" + item.slug} aria-label={"Explore draft: " + item.title} className="editorial-card-image">
                <Image src={item.artwork} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" />
                <span className="editorial-card-number">0{index + 1}</span>
              </Link>
              <div className="editorial-card-copy">
                <span className="editorial-status">Unpublished concept</span>
                <span className="editorial-card-category">{item.category}</span>
                <h3><Link href={"/" + kind + "/" + item.slug}>{item.title}</Link></h3>
                <p>{item.summary}</p>
                <Link href={"/" + kind + "/" + item.slug} className="text-link">View concept <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="editorial-filter-empty" role="status">
          <h3>No matching concepts</h3>
          <p>Try a different topic or search term.</p>
          <button className="button button--secondary" type="button" onClick={reset}><X size={16} aria-hidden="true" /> Reset filters</button>
        </div>
      )}
      {published.length > 0 && <p className="micro-note">Published items are reserved for verified editorial records.</p>}
    </div>
  );
}
