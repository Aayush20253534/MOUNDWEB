"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity, AlertTriangle, Archive, ArrowRight, BadgeCheck, BookOpen, Check,
  Clock3, FileText, Handshake, LayoutDashboard, LogIn, LogOut, Mail, Newspaper,
  RefreshCw, Save, ShieldCheck, X,
} from "lucide-react";
import {
  adminApiBase, adminRequest, AdminApiError, type AdminEditorial, type AdminLead,
  type AdminRole, type AdminSummary, type AdminUser, type LeadStatus,
} from "@/lib/admin-client";

type Tab = "overview" | "inquiries" | "partnerships" | "editorial";
const states: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "New" }, { value: "IN_REVIEW", label: "In review" },
  { value: "RESOLVED", label: "Resolved" }, { value: "ARCHIVED", label: "Archived" },
];
const episodeCategories = ["Brand Growth", "Creative Thinking", "Digital Learning"];
const mediaCategories = ["Perspectives", "Learning", "Studio Notes"];
function blankEditorial(kind: "PODCAST" | "MEDIA" = "MEDIA"): AdminEditorial {
  return {
    kind, slug: "", title: "", category: kind === "PODCAST" ? episodeCategories[0]! : mediaCategories[0]!,
    summary: "", artwork: "/assets/services/seo.webp", caption: "", topics: [],
    outline: [""], body: [], audioUrl: "", durationSeconds: undefined, transcript: "",
    author: "", status: "DRAFT",
  };
}
function humanDate(value?: string) {
  if (!value) return "Date pending";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
function errorMessage(error: unknown) {
  return error instanceof AdminApiError ? error.message : "Something went wrong. Try again.";
}
export function AdminConsole() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [inquiries, setInquiries] = useState<AdminLead[]>([]);
  const [partnerships, setPartnerships] = useState<AdminLead[]>([]);
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});
  const [leadStates, setLeadStates] = useState<Record<string, LeadStatus>>({});
  const [savingLead, setSavingLead] = useState<string | null>(null);
  const [editorial, setEditorial] = useState<AdminEditorial[]>([]);
  const [editorialKind, setEditorialKind] = useState<"PODCAST" | "MEDIA">("MEDIA");
  const [draft, setDraft] = useState<AdminEditorial>(() => blankEditorial());
  const [savingEditorial, setSavingEditorial] = useState(false);
  const hasApi = Boolean(adminApiBase());

  const loadCurrentUser = useCallback(async () => {
    setChecking(true); setConnectionError("");
    if (!adminApiBase()) {
      setConnectionError("The API URL is not configured in the frontend deployment. Set NEXT_PUBLIC_API_BASE_URL and redeploy.");
      setChecking(false); return;
    }
    try {
      const result = await adminRequest<{ user: AdminUser }>("/api/v1/admin/me");
      setUser(result.user); setGlobalError("");
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        setUser(null); setConnectionError("");
      } else {
        setUser(null); setConnectionError(errorMessage(error));
      }
    } finally { setChecking(false); }
  }, []);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    setGlobalError("");
    try {
      setSummary(await adminRequest<AdminSummary>("/api/v1/admin/summary"));
      if (user.role === "ADMIN" && (tab === "inquiries" || tab === "partnerships")) {
        const route = tab === "inquiries" ? "inquiries" : "partnerships";
        const data = await adminRequest<{ items: AdminLead[] }>("/api/v1/admin/" + route + "?page=1&limit=25");
        const items = data.items ?? [];
        if (tab === "inquiries") setInquiries(items); else setPartnerships(items);
        setLeadNotes((current) => ({ ...current, ...Object.fromEntries(items.map((item) => [item.id, item.internalNote ?? ""])) }));
        setLeadStates((current) => ({ ...current, ...Object.fromEntries(items.map((item) => [item.id, item.status])) }));
      }
      if (tab === "editorial") {
        const data = await adminRequest<{ items: AdminEditorial[] }>("/api/v1/admin/editorial");
        setEditorial(data.items ?? []);
      }
    } catch (error) {
      setGlobalError(errorMessage(error));
      if (error instanceof AdminApiError && error.status === 401) setUser(null);
    }
  }, [tab, user]);

  useEffect(() => { void loadCurrentUser(); }, [loadCurrentUser]);
  useEffect(() => { if (user) void loadDashboardData(); }, [user, tab, loadDashboardData]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (signingIn) return;
    setGlobalError(""); setConnectionError(""); setNotice(""); setSigningIn(true);
    try {
      const result = await adminRequest<{ user: AdminUser }>("/api/v1/admin/login", {
        method: "POST", body: JSON.stringify({ email, password }),
      });
      setUser(result.user); setPassword(""); setEmail(result.user.email); setTab("overview");
      setNotice("Signed in. Admin actions are recorded in the audit log.");
    } catch (error) { setGlobalError(errorMessage(error)); }
    finally { setSigningIn(false); }
  }
  async function signOut() {
    setGlobalError(""); setNotice("");
    try { await adminRequest<void>("/api/v1/admin/logout", { method: "POST", body: "{}" }); }
    catch (error) { setGlobalError(errorMessage(error)); }
    setUser(null); setSummary(null); setEditorial([]); setInquiries([]); setPartnerships([]);
  }
  async function saveLead(kind: "inquiries" | "partnerships", item: AdminLead) {
    setSavingLead(item.id); setGlobalError(""); setNotice("");
    try {
      await adminRequest("/api/v1/admin/" + kind + "/" + encodeURIComponent(item.id), {
        method: "PATCH",
        body: JSON.stringify({ status: leadStates[item.id] ?? item.status, internalNote: leadNotes[item.id] ?? "" }),
      });
      setNotice("Record updated. The change has been added to the audit log.");
      await loadDashboardData();
    } catch (error) { setGlobalError(errorMessage(error)); }
    finally { setSavingLead(null); }
  }
  async function saveEditorial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingEditorial) return;
    setSavingEditorial(true); setGlobalError(""); setNotice("");
    const slug = draft.slug.trim().toLowerCase();
    const payload = {
      ...draft, slug,
      topics: draft.topics,
      outline: draft.outline.map((value) => value.trim()).filter(Boolean),
      body: draft.body.map((value) => value.trim()).filter(Boolean),
      durationSeconds: draft.durationSeconds ? Number(draft.durationSeconds) : undefined,
    };
    try {
      const result = await adminRequest<{ item: AdminEditorial }>(
        "/api/v1/admin/editorial/" + draft.kind.toLowerCase() + "/" + encodeURIComponent(slug),
        { method: "PUT", body: JSON.stringify(payload) },
      );
      setEditorial((items) => [result.item, ...items.filter((item) => item.id !== result.item.id)]);
      setDraft(result.item);
      setNotice(result.item.status === "PUBLISHED" ? "Release saved and published. It is now eligible for the public feed." : "Editorial draft saved. Nothing was published.");
      setSummary(await adminRequest<AdminSummary>("/api/v1/admin/summary"));
    } catch (error) { setGlobalError(errorMessage(error)); }
    finally { setSavingEditorial(false); }
  }
  const visibleEditorial = useMemo(() => editorial.filter((item) => item.kind === editorialKind), [editorial, editorialKind]);
  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard; roles?: AdminRole[] }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "inquiries", label: "Inquiries", icon: Mail, roles: ["ADMIN"] },
    { key: "partnerships", label: "Partnerships", icon: Handshake, roles: ["ADMIN"] },
    { key: "editorial", label: "Editorial", icon: Newspaper, roles: ["ADMIN", "EDITOR"] },
  ];

  if (checking) return <section className="admin-shell container"><p className="eyebrow">MOUNDWEB control room</p><h1>Checking <em>session.</em></h1><div className="admin-loading" role="status">Checking the secure admin session…</div></section>;

  if (!user) return (
    <section className="admin-shell container">
      <div className="admin-login-layout">
        <div className="admin-login-intro">
          <span className="eyebrow">Part 12 / Private administration</span>
          <h1>Control the details. <em>Protect the trust.</em></h1>
          <p>Manage inquiries and approved editorial content through an authenticated session. Public visitors cannot access this workspace.</p>
          <div className="admin-assurance-list">
            <span><ShieldCheck size={18}/> Argon2id password verification</span>
            <span><Clock3 size={18}/> Expiring, revocable sessions</span>
            <span><Activity size={18}/> Audit trail for changes</span>
          </div>
        </div>
        <div className="admin-login-card">
          <div className="admin-mark"><ShieldCheck size={25}/></div>
          <p className="eyebrow">Restricted access</p>
          <h2>Admin sign in</h2>
          <p className="admin-muted">Use an admin account provisioned by the system operator. There is no public signup form.</p>
          {connectionError && <div className="admin-alert admin-alert--warning" role="status"><AlertTriangle size={18}/><span>{connectionError}</span></div>}
          {globalError && <div className="admin-alert" role="alert"><AlertTriangle size={18}/><span>{globalError}</span></div>}
          <form onSubmit={(event) => void signIn(event)} className="admin-login-form">
            <label htmlFor="admin-email">Admin email</label>
            <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} />
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={256} />
            <button className="button button--primary" type="submit" disabled={signingIn || !hasApi}><LogIn size={16}/>{signingIn ? "Verifying…" : "Sign in securely"}</button>
          </form>
          <p className="admin-security-note">The browser receives only an HTTP-only session cookie. Passwords and session tokens are never stored in localStorage.</p>
        </div>
      </div>
    </section>
  );

  return (
    <section className="admin-shell container">
      <div className="admin-page-heading">
        <div><p className="eyebrow">MOUNDWEB / Private workspace</p><h1>Control <em>center.</em></h1><p>Signed in as <strong>{user.email}</strong> · <span className="admin-role">{user.role}</span></p></div>
        <div className="admin-heading-actions">
          <button type="button" className="button button--secondary" onClick={() => void loadDashboardData()}><RefreshCw size={15}/> Refresh</button>
          <button type="button" className="button button--ghost" onClick={() => void signOut()}><LogOut size={16}/> Sign out</button>
        </div>
      </div>
      {globalError && <div className="admin-alert" role="alert"><AlertTriangle size={18}/><span>{globalError}</span></div>}
      {notice && <div className="admin-alert admin-alert--success" role="status"><Check size={18}/><span>{notice}</span><button type="button" aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16}/></button></div>}
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.filter((item) => !item.roles || item.roles.includes(user.role)).map((item) => {
          const Icon = item.icon;
          return <button type="button" key={item.key} aria-current={tab === item.key ? "page" : undefined} className={tab === item.key ? "admin-tab admin-tab--active" : "admin-tab"} onClick={() => setTab(item.key)}><Icon size={17}/>{item.label}</button>;
        })}
      </nav>
      {tab === "overview" && (
        <div className="admin-overview">
          <div className="admin-stats-grid">
            {user.role === "ADMIN" && <>
              <article className="admin-stat"><span><Mail size={18}/> Contact inquiries</span><strong>{summary?.inquiries ?? "—"}</strong><small>Stored and access-controlled</small></article>
              <article className="admin-stat"><span><Handshake size={18}/> Partnerships</span><strong>{summary?.partnerships ?? "—"}</strong><small>College and franchise requests</small></article>
            </>}
            <article className="admin-stat"><span><FileText size={18}/> Editorial drafts</span><strong>{summary?.editorialDrafts ?? "—"}</strong><small>Not publicly visible</small></article>
            <article className="admin-stat"><span><BadgeCheck size={18}/> Published releases</span><strong>{summary?.editorialPublished ?? "—"}</strong><small>Must pass content checks</small></article>
          </div>
          <div className="admin-dashboard-grid">
            <article className="admin-panel"><div className="admin-panel-icon"><ShieldCheck size={22}/></div><h2>Protected by default</h2><p>Inquiry content is only exposed to the ADMIN role. EDITOR accounts can edit editorial content but cannot open contact or partnership records.</p></article>
            <article className="admin-panel"><div className="admin-panel-icon"><Archive size={22}/></div><h2>Archive, don’t erase history</h2><p>Lead states are tracked, and changes are audited. This interface does not offer unaudited bulk exports or destructive deletion.</p></article>
            <article className="admin-panel"><div className="admin-panel-icon"><BookOpen size={22}/></div><h2>Publish with evidence</h2><p>Podcast releases require allow-listed audio, duration and a transcript. Media releases require an author and reviewed article text.</p></article>
          </div>
          <div className="admin-callout"><AlertTriangle size={18}/><p>Provision accounts and run the database migration before enabling ADMIN_ENABLED. Avoid using production data while testing.</p></div>
        </div>
      )}
      {(tab === "inquiries" || tab === "partnerships") && user.role === "ADMIN" && (
        <div className="admin-leads">
          <div className="admin-section-heading"><div><p className="eyebrow">Private contact records</p><h2>{tab === "inquiries" ? "Contact inquiries" : "Partnership requests"}</h2><p>Showing the latest 25 records. Changes are written to the audit log.</p></div><span className="admin-count">{tab === "inquiries" ? inquiries.length : partnerships.length} loaded</span></div>
          {(tab === "inquiries" ? inquiries : partnerships).length === 0 ? (
            <div className="admin-empty"><Mail size={24}/><h3>No records in this page</h3><p>When submissions have been enabled and stored, records will appear here.</p></div>
          ) : (tab === "inquiries" ? inquiries : partnerships).map((item) => (
            <article className="admin-lead-card" key={item.id}>
              <div className="admin-lead-top"><div><span className="admin-record-kicker">{tab === "inquiries" ? item.category ?? "Inquiry" : item.kind ?? "Partnership"} · {humanDate(item.createdAt)}</span><h3>{item.subject || item.organization || "Inquiry record"}</h3><p>{item.name} · <a href={"mailto:" + item.email}>{item.email}</a>{item.phone ? " · " + item.phone : ""}</p></div><span className={"admin-status admin-status--" + (leadStates[item.id] ?? item.status).toLowerCase()}>{(leadStates[item.id] ?? item.status).replace("_", " ")}</span></div>
              {item.organization && <p className="admin-org-line">{item.organization} · {item.role} · {item.location}</p>}
              <details className="admin-message-details"><summary>Read message</summary><p>{item.message}</p></details>
              <div className="admin-lead-controls">
                <label>Record status<select value={leadStates[item.id] ?? item.status} onChange={(event) => setLeadStates((current) => ({ ...current, [item.id]: event.target.value as LeadStatus }))}>{states.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}</select></label>
                <label className="admin-note-field">Internal note<textarea value={leadNotes[item.id] ?? ""} maxLength={2000} rows={2} onChange={(event) => setLeadNotes((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Add a brief internal follow-up note"/></label>
                <button type="button" className="button button--secondary" disabled={savingLead === item.id} onClick={() => void saveLead(tab as "inquiries" | "partnerships", item)}><Save size={15}/>{savingLead === item.id ? "Saving…" : "Save update"}</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {tab === "editorial" && (
        <div className="admin-editorial">
          <div className="admin-section-heading"><div><p className="eyebrow">Podcast & Media CMS</p><h2>Editorial publishing</h2><p>Draft records stay private. Only verified releases enter the public feed.</p></div><button type="button" className="button button--primary" onClick={() => setDraft(blankEditorial(editorialKind))}><FileText size={16}/> New draft</button></div>
          <div className="admin-editorial-switch" role="group" aria-label="Editorial section">
            <button type="button" aria-pressed={editorialKind === "PODCAST"} className={editorialKind === "PODCAST" ? "is-selected" : ""} onClick={() => { setEditorialKind("PODCAST"); setDraft(blankEditorial("PODCAST")); }}>Podcast episodes</button>
            <button type="button" aria-pressed={editorialKind === "MEDIA"} className={editorialKind === "MEDIA" ? "is-selected" : ""} onClick={() => { setEditorialKind("MEDIA"); setDraft(blankEditorial("MEDIA")); }}>Media releases</button>
          </div>
          <div className="admin-editorial-layout">
            <div className="admin-editorial-list"><h3>Saved records <span>{visibleEditorial.length}</span></h3>
              {visibleEditorial.length === 0 && <p className="admin-muted">No records yet. Start a draft to plan an approved release.</p>}
              {visibleEditorial.map((item) => <button className="admin-editorial-row" key={item.id} type="button" onClick={() => setDraft(item)}><span className={"admin-status admin-status--" + item.status.toLowerCase()}>{item.status}</span><strong>{item.title}</strong><small>/{item.kind.toLowerCase()}/{item.slug}</small></button>)}
            </div>
            <form className="admin-editorial-form" onSubmit={(event) => void saveEditorial(event)}>
              <div className="admin-editorial-form-heading"><div><span className="eyebrow">{draft.id ? "Edit saved record" : "New editorial record"}</span><h3>{draft.title || "Untitled draft"}</h3></div><span className={"admin-status admin-status--" + draft.status.toLowerCase()}>{draft.status}</span></div>
              <div className="admin-form-grid">
                <label>URL slug<input required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={(event) => setDraft((item) => ({ ...item, slug: event.target.value }))} placeholder="a-useful-story"/></label>
                <label>Category<select value={draft.category} onChange={(event) => setDraft((item) => ({ ...item, category: event.target.value }))}>{(draft.kind === "PODCAST" ? episodeCategories : mediaCategories).map((category) => <option key={category}>{category}</option>)}</select></label>
              </div>
              <label>Title<input required maxLength={140} value={draft.title} onChange={(event) => setDraft((item) => ({ ...item, title: event.target.value }))}/></label>
              <label>Summary<textarea required rows={3} maxLength={600} value={draft.summary} onChange={(event) => setDraft((item) => ({ ...item, summary: event.target.value }))}/></label>
              <label>Approved artwork path<input required maxLength={400} value={draft.artwork} onChange={(event) => setDraft((item) => ({ ...item, artwork: event.target.value }))} placeholder="/assets/services/seo.webp"/></label>
              <label>Topics, separated by commas<input value={draft.topics.join(", ")} onChange={(event) => setDraft((item) => ({ ...item, topics: event.target.value.split(",").map((part) => part.trim()).filter(Boolean) }))}/></label>
              <label>Outline, one point per line<textarea required rows={3} value={draft.outline.join("\n")} onChange={(event) => setDraft((item) => ({ ...item, outline: event.target.value.split("\n") }))}/></label>
              {draft.kind === "PODCAST" ? <>
                <label>Approved audio URL<input value={draft.audioUrl ?? ""} onChange={(event) => setDraft((item) => ({ ...item, audioUrl: event.target.value }))} placeholder="/assets/audio/episode.mp3 or allow-listed HTTPS URL"/></label>
                <label>Duration (seconds)<input type="number" min={1} max={86400} value={draft.durationSeconds ?? ""} onChange={(event) => setDraft((item) => ({ ...item, durationSeconds: event.target.value ? Number(event.target.value) : undefined }))}/></label>
                <label>Accessible transcript<textarea rows={6} value={draft.transcript ?? ""} onChange={(event) => setDraft((item) => ({ ...item, transcript: event.target.value }))}/></label>
              </> : <>
                <label>Author / editorial owner<input maxLength={100} value={draft.author ?? ""} onChange={(event) => setDraft((item) => ({ ...item, author: event.target.value }))}/></label>
                <label>Illustration caption<textarea rows={2} maxLength={600} value={draft.caption ?? ""} onChange={(event) => setDraft((item) => ({ ...item, caption: event.target.value }))}/></label>
                <label>Reviewed article body (paragraphs separated by blank lines)<textarea rows={8} value={draft.body.join("\n\n")} onChange={(event) => setDraft((item) => ({ ...item, body: event.target.value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean) }))}/></label>
              </>}
              <label>Publishing state<select value={draft.status} onChange={(event) => setDraft((item) => ({ ...item, status: event.target.value as AdminEditorial["status"] }))}><option value="DRAFT">Draft · private</option><option value="PUBLISHED">Publish after validation</option><option value="ARCHIVED">Archive · hidden</option></select></label>
              <div className="admin-form-actions"><button className="button button--primary" type="submit" disabled={savingEditorial}><Save size={16}/>{savingEditorial ? "Saving…" : draft.status === "PUBLISHED" ? "Validate & publish" : "Save editorial record"}</button><button className="button button--ghost" type="button" onClick={() => setDraft(blankEditorial(editorialKind))}><X size={15}/> Clear</button></div>
              <p className="admin-security-note">Publishing changes public pages only after required source material passes server checks. Drafts and archives stay hidden.</p>
            </form>
          </div>
        </div>
      )}
      <footer className="admin-console-footer"><ShieldCheck size={16}/><span>Private admin endpoints are no-store, origin-checked and role-gated. Session tokens are hashed before persistence.</span><ArrowRight size={15}/></footer>
    </section>
  );
}
