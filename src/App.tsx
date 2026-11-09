import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

type Role = "seeker" | "employer";
type Page = "Discover" | "My applications" | "Saved jobs" | "My profile" | "My listings";
type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  logoClass: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  featured?: boolean;
};
type Application = { jobId: string; date: string; status: string; applicantName: string; email: string; note: string };
type Profile = { name: string; title: string; location: string; about: string; skills: string };

const initialJobs: Job[] = [
  {
    id: "design-lead",
    title: "Senior Product Designer",
    company: "Layers",
    logo: "L",
    logoClass: "logo-purple",
    location: "San Francisco, CA · Remote",
    type: "Full-time",
    category: "Design",
    salary: "$140k – $180k",
    posted: "2 days ago",
    description: "Help us make complex work feel beautifully simple. You'll shape the product experience from early ideas to polished, shipped details.",
    skills: ["Product design", "Figma", "Design systems"],
    featured: true,
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    company: "Linear",
    logo: "↗",
    logoClass: "logo-dark",
    location: "New York, NY · Hybrid",
    type: "Full-time",
    category: "Engineering",
    salary: "$150k – $195k",
    posted: "1 day ago",
    description: "Build fast, thoughtful interfaces that help ambitious teams do their best work. We care deeply about craft, performance, and the details in between.",
    skills: ["React", "TypeScript", "CSS"],
  },
  {
    id: "brand-designer",
    title: "Brand Designer",
    company: "Notion",
    logo: "N",
    logoClass: "logo-sand",
    location: "Remote · US",
    type: "Full-time",
    category: "Design",
    salary: "$115k – $150k",
    posted: "3 days ago",
    description: "Tell stories that make people feel something. Partner with a close-knit creative team to bring a much-loved brand into its next chapter.",
    skills: ["Brand identity", "Art direction", "Illustration"],
  },
  {
    id: "growth-marketer",
    title: "Growth Marketing Manager",
    company: "Arc",
    logo: "a",
    logoClass: "logo-blue",
    location: "Brooklyn, NY · Hybrid",
    type: "Full-time",
    category: "Marketing",
    salary: "$105k – $135k",
    posted: "4 days ago",
    description: "Make the internet a little more human. Own creative growth experiments across channels and turn what works into repeatable playbooks.",
    skills: ["Growth strategy", "Content", "Analytics"],
  },
  {
    id: "product-manager",
    title: "Associate Product Manager",
    company: "Headspace",
    logo: "h",
    logoClass: "logo-orange",
    location: "Remote · US",
    type: "Full-time",
    category: "Product",
    salary: "$100k – $130k",
    posted: "5 days ago",
    description: "Help us build products that make mental healthcare more accessible, one considered and empathetic feature at a time.",
    skills: ["Product thinking", "Research", "Roadmapping"],
  },
  {
    id: "backend-engineer",
    title: "Backend Software Engineer",
    company: "Vercel",
    logo: "▲",
    logoClass: "logo-dark",
    location: "Remote · North America",
    type: "Full-time",
    category: "Engineering",
    salary: "$160k – $210k",
    posted: "1 week ago",
    description: "Help build the platform behind the world's best frontend teams. Design reliable systems and thoughtful APIs at a global scale.",
    skills: ["Node.js", "Distributed systems", "PostgreSQL"],
  },
];

const defaultProfile: Profile = {
  name: "Alex Morgan",
  title: "Product designer who loves making things click",
  location: "Brooklyn, New York",
  about: "I'm a product designer with 5 years of experience turning complex problems into clear, helpful experiences. I care about the little details and the people behind every screen.",
  skills: "Product design, Figma, Prototyping, Design systems, User research",
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<string, ReactNode> = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2" /></>,
    bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4Z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    grid: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" /><rect x="13" y="10" width="8" height="11" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" /></>,
    arrow: <><path d="M5 12h14m-7-7 7 7-7 7" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrowUp: <><path d="M12 19V5m-7 7 7-7 7 7" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 10v-2a4 4 0 0 0-3-3.87m-1-12a4 4 0 0 1 0 7.75" /></>,
  };
  return <svg {...common}>{paths[name] ?? paths.sparkles}</svg>;
}

function App() {
  const [role, setRole] = useState<Role>(() => readStorage("careerly-role", "seeker"));
  const [page, setPage] = useState<Page>("Discover");
  const [jobs, setJobs] = useState<Job[]>(() => readStorage("careerly-jobs", initialJobs));
  const [saved, setSaved] = useState<string[]>(() => readStorage("careerly-saved", ["brand-designer"]));
  const [applications, setApplications] = useState<Application[]>(() => readStorage("careerly-applications", []));
  const [profile, setProfile] = useState<Profile>(() => readStorage("careerly-profile", defaultProfile));
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All roles");
  const [modal, setModal] = useState<"apply" | "post" | "profile" | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { localStorage.setItem("careerly-role", JSON.stringify(role)); }, [role]);
  useEffect(() => { localStorage.setItem("careerly-jobs", JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem("careerly-saved", JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem("careerly-applications", JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem("careerly-profile", JSON.stringify(profile)); }, [profile]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const matchesText = `${job.title} ${job.company} ${job.location} ${job.category} ${job.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = category === "All roles" || job.category === category;
    const matchesPage = page !== "Saved jobs" || saved.includes(job.id);
    return matchesText && matchesLocation && matchesCategory && matchesPage;
  }), [jobs, query, location, category, page, saved]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMobileNav(false);
    setQuery("");
    setLocation("");
    setCategory("All roles");
  };

  const toggleSaved = (id: string) => {
    const isSaved = saved.includes(id);
    setSaved(isSaved ? saved.filter((item) => item !== id) : [...saved, id]);
    setToast(isSaved ? "Removed from saved jobs" : "Job saved for later");
  };

  const submitApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedJob) return;
    const formData = new FormData(event.currentTarget);
    setApplications((items) => [{
      jobId: selectedJob.id,
      date: new Date().toISOString(),
      status: "In review",
      applicantName: String(formData.get("name")).trim(),
      email: String(formData.get("email")).trim(),
      note: String(formData.get("note")).trim(),
    }, ...items.filter((item) => item.jobId !== selectedJob.id)]);
    setModal(null);
    setSelectedJob(null);
    setToast("Application sent — good luck!");
    setPage("My applications");
  };

  const submitListing = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title")).trim();
    const company = String(formData.get("company")).trim();
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title,
      company,
      logo: company.charAt(0).toUpperCase(),
      logoClass: "logo-teal",
      location: `${String(formData.get("location")).trim()} · ${String(formData.get("workplace"))}`,
      type: String(formData.get("type")),
      category: String(formData.get("category")),
      salary: String(formData.get("salary")).trim() || "Salary not specified",
      posted: "Just now",
      description: String(formData.get("description")).trim(),
      skills: String(formData.get("skills")).split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 3),
    };
    setJobs((items) => [newJob, ...items]);
    setModal(null);
    setToast("Your job is live — let's find your next great hire.");
    setPage("My listings");
  };

  const navItems: { page: Page; icon: string; count?: number }[] = role === "seeker"
    ? [{ page: "Discover", icon: "grid" }, { page: "My applications", icon: "briefcase", count: applications.length || undefined }, { page: "Saved jobs", icon: "bookmark", count: saved.length || undefined }, { page: "My profile", icon: "user" }]
    : [{ page: "My listings", icon: "grid", count: jobs.filter((job) => job.id.startsWith("job-")).length || undefined }, { page: "Discover", icon: "briefcase" }, { page: "My profile", icon: "user" }];

  const openApplication = (job: Job) => {
    setSelectedJob(job);
    setModal("apply");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate(role === "seeker" ? "Discover" : "My listings"); }}>
          <span className="brand-mark"><Icon name="sparkles" size={19} /></span>
          <span>careerly<span className="brand-period">.</span></span>
        </a>
        <button className="role-switch" onClick={() => { setRole(role === "seeker" ? "employer" : "seeker"); setPage(role === "seeker" ? "My listings" : "Discover"); }}>
          <span className={`role-icon ${role === "employer" ? "employer-icon" : ""}`}><Icon name={role === "seeker" ? "user" : "briefcase"} size={17} /></span>
          <span className="role-copy"><strong>{role === "seeker" ? "Job seeker" : "Employer"}</strong><small>Switch workspace</small></span>
          <span className="switch-arrows">↕</span>
        </button>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.page} className={`nav-item ${page === item.page ? "nav-active" : ""}`} onClick={() => navigate(item.page)}>
              <Icon name={item.icon} size={19} /><span>{item.page}</span>
              {item.count ? <span className="nav-count">{item.count}</span> : null}
            </button>
          ))}
        </nav>

        {role === "seeker" ? (
          <div className="sidebar-tip">
            <div className="tip-icon"><Icon name="sparkles" size={18} /></div>
            <strong>A little profile goes a long way</strong>
            <p>Stand out to the teams looking for someone like you.</p>
            <button onClick={() => setModal("profile")}>Complete your profile <Icon name="arrow" size={15} /></button>
            <div className="profile-progress"><span /></div>
            <small>Profile strength <b>72%</b></small>
          </div>
        ) : (
          <div className="employer-prompt">
            <span className="tip-icon"><Icon name="users" size={18} /></span>
            <strong>Meet your next great hire.</strong>
            <p>A great team starts with a great job post.</p>
            <button className="button-primary small-button" onClick={() => setModal("post")}><Icon name="plus" size={16} /> Post a job</button>
          </div>
        )}

        <div className="sidebar-bottom">
          <div className="help-line"><span className="help-dot">?</span> Need a hand? <button onClick={() => setToast("Our friendly support team is here at hello@careerly.com")}>Get in touch</button></div>
          <button className="mini-profile" onClick={() => navigate("My profile")}>
            <div className="avatar">AM</div>
            <span><strong>{role === "seeker" ? profile.name : "Olivia Chen"}</strong><small>{role === "seeker" ? "Personal account" : "People & Culture"}</small></span>
            <span className="more-dots">···</span>
          </button>
        </div>
      </aside>
      {mobileNav && <button className="sidebar-backdrop" aria-label="Close navigation menu" onClick={() => setMobileNav(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label={mobileNav ? "Close menu" : "Open menu"} onClick={() => setMobileNav(!mobileNav)}><Icon name="menu" /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div>
          <div className="topbar-actions">
            <span className="welcome-date">Monday, November 9</span>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast("You're all caught up — no new notifications.")}><Icon name="bell" size={19} /><i /></button>
            <button className="top-avatar" aria-label="Open your profile" onClick={() => navigate("My profile")}>AM</button>
          </div>
        </header>

        <div className="content-wrap">
          {role === "seeker" && (page === "Discover" || page === "Saved jobs") && (
            <>
              <section className="hero-panel">
                <div className="hero-copy">
                  <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</div>
                  <h1>Find work that<br />feels like <span>you.</span></h1>
                  <p>Good people deserve good work. Let’s find a place<br className="desktop-break" /> where you can do your best of it.</p>
                  <div className="hero-stat"><div className="stat-faces"><span>J</span><span>M</span><span>A</span><span>+</span></div><span><b>2,400+</b> people found their fit this month</span></div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="art-sun" /><div className="art-blob" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
                  <div className="art-card art-card-main"><span className="art-check"><Icon name="check" size={14} /></span><span className="art-lines"><i /><i /><i /></span><span className="art-dot" /></div>
                  <div className="art-card art-card-float"><span className="art-mini-avatar">✳</span><span className="art-lines"><i /><i /></span></div>
                  <span className="art-sparkle sparkle-one">✳</span><span className="art-sparkle sparkle-two">✦</span>
                </div>
                <div className="hero-bottom-line"><span>Small teams. Big possibilities.</span><span className="hero-line" /><span>Made for people, not just résumés.</span></div>
              </section>

              <section className="search-section" aria-label="Search jobs">
                <div className="search-field"><Icon name="search" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job title, skill, or company" aria-label="Search by job title, skill, or company" />{query && <button className="clear-search" onClick={() => setQuery("")}><Icon name="close" size={16} /></button>}</div>
                <span className="search-divider" />
                <div className="search-field location-search"><Icon name="pin" size={19} /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or remote" aria-label="Location" /></div>
                <button className="button-primary search-button" onClick={() => document.getElementById("job-list")?.scrollIntoView({ behavior: "smooth" })}>Find my fit <Icon name="arrow" size={17} /></button>
              </section>

              <section className="jobs-section" id="job-list">
                <div className="section-heading">
                  <div><div className="section-kicker">{page === "Saved jobs" ? "YOUR SHORTLIST" : "A FEW GOOD PLACES TO START"}</div><h2>{page === "Saved jobs" ? "Saved for later" : "Thought you'd like these"} <span className="result-count">{filteredJobs.length}</span></h2></div>
                  <button className="text-button" onClick={() => setToast("You're viewing all available roles.")}>View all roles <Icon name="arrow" size={16} /></button>
                </div>
                <div className="category-row">
                  {["All roles", "Design", "Engineering", "Marketing", "Product"].map((item) => <button key={item} className={`category-chip ${category === item ? "chip-active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}
                  <span className="category-note"><Icon name="sparkles" size={15} /> Curated with care</span>
                </div>
                <div className="job-list">
                  {filteredJobs.length ? filteredJobs.map((job, index) => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onSave={() => toggleSaved(job.id)} onApply={() => openApplication(job)} onSelect={() => { setSelectedJob(job); setModal("apply"); }} featured={index === 0 && page === "Discover"} />) : (
                    <div className="empty-state"><span className="empty-icon"><Icon name={page === "Saved jobs" ? "bookmark" : "search"} size={23} /></span><h3>{page === "Saved jobs" ? "Your shortlist is a blank canvas" : "No roles found just yet"}</h3><p>{page === "Saved jobs" ? "Save a job that catches your eye and it’ll be waiting here." : "Try another search or explore a different category."}</p>{page === "Saved jobs" && <button className="text-button" onClick={() => navigate("Discover")}>Explore roles <Icon name="arrow" size={16} /></button>}</div>
                  )}
                </div>
                {filteredJobs.length > 0 && <button className="load-more" onClick={() => setToast("You're all caught up — check back soon for new roles.")}>You’re all caught up <span>✳</span></button>}
              </section>
            </>
          )}

          {role === "seeker" && page === "My applications" && (
            <ApplicationsPage applications={applications} jobs={jobs} onExplore={() => navigate("Discover")} />
          )}

          {role === "seeker" && page === "My profile" && (
            <ProfilePage profile={profile} onEdit={() => setModal("profile")} applications={applications.length} saved={saved.length} />
          )}

          {role === "employer" && page === "My listings" && (
            <EmployerPage
              jobs={jobs.filter((job) => job.id.startsWith("job-"))}
              applications={applications}
              onPost={() => setModal("post")}
              onUpdateApplicationStatus={(jobId, date, status) => setApplications((items) => items.map((application) =>
                application.jobId === jobId && application.date === date ? { ...application, status } : application,
              ))}
            />
          )}
          {role === "employer" && page === "Discover" && (
            <div className="employer-discover">
              <div className="section-kicker">TALENT, WITHOUT THE GUESSWORK</div><h1>Good teams start<br />with <span>good people.</span></h1><p>Post a thoughtful role, meet people who care about their craft, and find the one who just gets it.</p>
              <button className="button-primary" onClick={() => setModal("post")}><Icon name="plus" size={18} /> Post your first job</button>
              <div className="employer-benefits"><div><span>01</span><b>Write it your way</b><small>Tell candidates what makes your team different.</small></div><div><span>02</span><b>Meet the right people</b><small>Give thoughtful candidates a place to shine.</small></div><div><span>03</span><b>Find your fit</b><small>Review applicants and move forward together.</small></div></div>
            </div>
          )}
        </div>
      </main>

      {modal && <Modal onClose={() => { setModal(null); setSelectedJob(null); }}>
        {modal === "apply" && selectedJob && <ApplicationForm job={selectedJob} profile={profile} onSubmit={submitApplication} />}
        {modal === "post" && <PostJobForm onSubmit={submitListing} onCancel={() => setModal(null)} />}
        {modal === "profile" && <ProfileForm profile={profile} onSave={(nextProfile) => { setProfile(nextProfile); setModal(null); setToast("Profile updated — looking good!"); }} />}
      </Modal>}
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={14} /></span>{toast}</div>}
    </div>
  );
}

function JobCard({ job, saved, onSave, onApply, onSelect, featured }: { job: Job; saved: boolean; onSave: () => void; onApply: () => void; onSelect: () => void; featured: boolean }) {
  return (
    <article className={`job-card ${featured ? "job-featured" : ""}`}>
      {featured && <div className="featured-ribbon"><Icon name="sparkles" size={14} /> A little something special</div>}
      <div className="job-card-top">
        <button className={`company-logo ${job.logoClass}`} onClick={onSelect} aria-label={`View ${job.company} job details`}>{job.logo}</button>
        <div className="job-heading"><button className="job-title-link" onClick={onSelect}>{job.title}</button><div className="company-line">{job.company}<span className="verified-mark">✓</span><span className="company-separator">·</span><span>{job.posted}</span></div></div>
        <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={onSave} aria-label={saved ? "Remove saved job" : "Save job"}><Icon name="bookmark" size={19} /></button>
      </div>
      <p className="job-description">{job.description}</p>
      <div className="job-meta">
        <span><Icon name="pin" size={15} />{job.location}</span><i /><span><Icon name="briefcase" size={15} />{job.type}</span><i /><strong>{job.salary}</strong>
      </div>
      <div className="job-card-bottom"><div className="skill-tags">{job.skills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div><button className="apply-button" onClick={onApply}>Apply now <Icon name="arrow" size={16} /></button></div>
    </article>
  );
}

function ApplicationsPage({ applications, jobs, onExplore }: { applications: Application[]; jobs: Job[]; onExplore: () => void }) {
  return (
    <section className="page-section">
      <div className="section-kicker">YOUR NEXT CHAPTER</div><h1 className="page-title">My applications<span className="result-count">{applications.length}</span></h1><p className="page-subtitle">A little progress is still progress. Here’s where things stand.</p>
      {applications.length === 0 ? <div className="empty-state applications-empty"><span className="empty-icon"><Icon name="briefcase" size={23} /></span><h3>Every great story starts somewhere</h3><p>You haven’t applied to any roles yet. Find a team that feels right and take the first step.</p><button className="button-primary" onClick={onExplore}>Explore open roles <Icon name="arrow" size={16} /></button></div> : <div className="application-list">{applications.map((application) => {
        const job = jobs.find((item) => item.id === application.jobId);
        if (!job) return null;
        return <article className="application-card" key={application.jobId}><div className={`company-logo ${job.logoClass}`}>{job.logo}</div><div className="application-info"><h3>{job.title}</h3><p>{job.company} <span>·</span> Applied {new Date(application.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p></div><span className="status-pill"><i />{application.status}</span><button className="icon-button application-arrow" aria-label={`View ${job.title}`}><Icon name="arrow" size={18} /></button></article>;
      })}</div>}
      <div className="application-note"><span>✳</span><p><strong>A small reminder:</strong> you’re more than a résumé. Keep showing up as yourself.</p></div>
    </section>
  );
}

function ProfilePage({ profile, onEdit, applications, saved }: { profile: Profile; onEdit: () => void; applications: number; saved: number }) {
  return (
    <section className="page-section profile-page">
      <div className="section-kicker">A LITTLE ABOUT YOU</div><h1 className="page-title">My profile</h1><p className="page-subtitle">The person behind the good work.</p>
      <div className="profile-card"><div className="profile-cover"><span>✳</span><span>✦</span><span>✳</span></div><div className="profile-main"><div className="profile-avatar">AM</div><button className="edit-profile-button" onClick={onEdit}>Edit profile <Icon name="arrow" size={15} /></button><h2>{profile.name}</h2><p className="profile-title">{profile.title}</p><p className="profile-location"><Icon name="pin" size={16} />{profile.location}</p><div className="profile-divider" /><h3>A little about me</h3><p className="profile-about">{profile.about}</p><h3>Things I’m good at</h3><div className="skill-tags profile-skills">{profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => <span key={skill}>{skill}</span>)}</div><div className="profile-stats"><div><b>{applications}</b><span>Applications</span></div><div><b>{saved}</b><span>Saved roles</span></div><div><b>72%</b><span>Profile strength</span></div></div></div></div>
    </section>
  );
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function ApplicationTrendChart({ applications }: { applications: Application[] }) {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const key = getMonthKey(date);
    return {
      key,
      label: date.toLocaleDateString(undefined, { month: "short" }),
      count: applications.filter((application) => {
        const appliedAt = new Date(application.date);
        return !Number.isNaN(appliedAt.getTime()) && getMonthKey(appliedAt) === key;
      }).length,
    };
  });
  const maxCount = Math.max(...months.map((month) => month.count));
  const chartMax = Math.max(3, Math.ceil(maxCount / 3) * 3);
  const plot = { top: 17, bottom: 155, left: 37, right: 577 };
  const chartHeight = plot.bottom - plot.top;
  const slotWidth = (plot.right - plot.left) / months.length;
  const barWidth = 34;
  const description = months.map((month) => `${month.label}: ${month.count} applications`).join(", ");

  return (
    <div className="trend-chart">
      <div className="chart-summary"><strong>{months[months.length - 1].count}</strong><span>applications this month</span></div>
      <svg className="trend-svg" viewBox="0 0 600 196" role="img" aria-label={`Application trend over the last six months. ${description}.`}>
        {[0, 1, 2, 3].map((step) => {
          const value = chartMax * (3 - step) / 3;
          const y = plot.top + (chartHeight * step / 3);
          return <g key={step}><line x1={plot.left} x2={plot.right} y1={y} y2={y} className="chart-grid-line" /><text x={plot.left - 10} y={y + 3} textAnchor="end" className="chart-axis-label">{value}</text></g>;
        })}
        {months.map((month, index) => {
          const barHeight = month.count / chartMax * chartHeight;
          const x = plot.left + slotWidth * index + (slotWidth - barWidth) / 2;
          const y = plot.bottom - barHeight;
          return <g key={month.key} className="trend-bar-group">
            <rect className={`trend-bar ${index === months.length - 1 ? "trend-bar-current" : ""}`} x={x} y={y} width={barWidth} height={barHeight} rx="5" />
            <text x={x + barWidth / 2} y={Math.max(plot.top - 3, y - 7)} textAnchor="middle" className="chart-value-label">{month.count}</text>
            <text x={x + barWidth / 2} y={plot.bottom + 21} textAnchor="middle" className="chart-axis-label chart-month-label">{month.label}</text>
          </g>;
        })}
      </svg>
    </div>
  );
}

function HiringFunnelChart({ applications }: { applications: Application[] }) {
  const currentMonthKey = getMonthKey(new Date());
  const currentMonthApplications = applications.filter((application) => {
    const appliedAt = new Date(application.date);
    return !Number.isNaN(appliedAt.getTime()) && getMonthKey(appliedAt) === currentMonthKey;
  });
  const segments = [
    { label: "In review", color: "#8da487", count: currentMonthApplications.filter((application) => application.status === "In review").length },
    { label: "Shortlisted", color: "#526d55", count: currentMonthApplications.filter((application) => application.status === "Shortlisted").length },
    { label: "Next steps", color: "#d9b685", count: currentMonthApplications.filter((application) => application.status !== "In review" && application.status !== "Shortlisted").length },
  ];
  const total = currentMonthApplications.length;
  const circumference = 2 * Math.PI * 44;
  let consumed = 0;
  const description = segments.map((segment) => `${segment.label}: ${segment.count}`).join(", ");

  return (
    <div className="funnel-chart">
      <div className="funnel-donut-wrap">
        <svg className="funnel-donut" viewBox="0 0 112 112" role="img" aria-label={`Monthly hiring funnel, ${total} applications. ${description}.`}>
          <circle className="funnel-track" cx="56" cy="56" r="44" />
          {total === 0 ? <circle className="funnel-empty-ring" cx="56" cy="56" r="44" /> : segments.filter((segment) => segment.count > 0).map((segment) => {
            const length = segment.count / total * circumference;
            const offset = consumed;
            consumed += length;
            return <circle key={segment.label} cx="56" cy="56" r="44" fill="none" stroke={segment.color} strokeWidth="13" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} className="funnel-segment" />;
          })}
          <text x="56" y="52" textAnchor="middle" className="funnel-total">{total}</text>
          <text x="56" y="67" textAnchor="middle" className="funnel-total-label">APPLIED</text>
        </svg>
      </div>
      <div className="funnel-legend">{segments.map((segment) => (
        <div className="funnel-legend-item" key={segment.label}>
          <span className="funnel-legend-dot" style={{ backgroundColor: segment.color }} />
          <span>{segment.label}</span>
          <strong>{segment.count}</strong>
        </div>
      ))}</div>
    </div>
  );
}

function EmployerPage({
  jobs,
  applications,
  onPost,
  onUpdateApplicationStatus,
}: {
  jobs: Job[];
  applications: Application[];
  onPost: () => void;
  onUpdateApplicationStatus: (jobId: string, date: string, status: string) => void;
}) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const activeApplications = applications.filter((application) => jobs.some((job) => job.id === application.jobId));
  const shortlistedCount = activeApplications.filter((application) => application.status === "Shortlisted").length;
  return (
    <section className="page-section employer-page">
      <div className="employer-heading-row"><div><div className="section-kicker">PEOPLE FIRST, ALWAYS</div><h1 className="page-title">Good morning, Olivia <span>✳</span></h1><p className="page-subtitle">Here’s a little snapshot of your hiring journey.</p></div><button className="button-primary" onClick={onPost}><Icon name="plus" size={17} /> Post a new role</button></div>
      <div className="employer-stats">
        <div><span>ACTIVE JOB LISTINGS</span><b>{jobs.length.toString().padStart(2, "0")}</b><small><i className="live-dot" /> Open to applicants</small></div>
        <div><span>TOTAL APPLICATIONS</span><b>{activeApplications.length.toString().padStart(2, "0")}</b><small>Across all active roles</small></div>
        <div><span>SHORTLISTED CANDIDATES</span><b>{shortlistedCount.toString().padStart(2, "0")}</b><small>Ready for your next step</small></div>
        <div><span>PROFILE VIEWS</span><b>128</b><small>People finding your team</small></div>
      </div>
      <div className="dashboard-charts">
        <section className="dashboard-chart-card">
          <div className="chart-card-heading"><div><div className="section-kicker">APPLICATIONS OVER TIME</div><h2>Application trend</h2></div><span className="chart-period"><Icon name="clock" size={14} /> Last 6 months</span></div>
          <ApplicationTrendChart applications={activeApplications} />
        </section>
        <section className="dashboard-chart-card">
          <div className="chart-card-heading"><div><div className="section-kicker">THIS MONTH</div><h2>Hiring funnel</h2></div><span className="chart-period">Monthly</span></div>
          <HiringFunnelChart applications={activeApplications} />
        </section>
      </div>
      <div className="section-heading listing-heading"><div><div className="section-kicker">THE ROLES YOU’RE SHARING</div><h2>Active job listings <span className="result-count">{jobs.length}</span></h2></div></div>
      {jobs.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name="briefcase" size={23} /></span><h3>Your next great hire starts with a hello</h3><p>Share what makes your team special. Your first job post is just a few details away.</p><button className="button-primary" onClick={onPost}><Icon name="plus" size={17} /> Create a job listing</button></div> : <div className="listing-list">{jobs.map((job) => {
        const jobApplications = applications.filter((application) => application.jobId === job.id);
        const jobShortlisted = jobApplications.filter((application) => application.status === "Shortlisted").length;
        const isSelected = selectedJobId === job.id;
        return <div key={job.id}><article className={`listing-card ${isSelected ? "listing-selected" : ""}`}><div className={`company-logo ${job.logoClass}`}>{job.logo}</div><div className="listing-main"><h3>{job.title}</h3><p>{job.location} <span>·</span> Posted {job.posted}</p></div><span className="status-pill"><i />Active</span><div className="listing-metric"><b>{jobApplications.length}</b><span>applications</span></div><div className="listing-metric shortlist-metric"><b>{jobShortlisted}</b><span>shortlisted</span></div><button className="icon-button application-arrow" aria-label={`${isSelected ? "Hide" : "View"} applicants for ${job.title}`} aria-expanded={isSelected} onClick={() => setSelectedJobId(isSelected ? null : job.id)}><Icon name="arrow" size={18} /></button></article>
          {isSelected && <div className="applicant-panel"><div className="applicant-panel-heading"><h3>People who raised their hand</h3><span>{jobApplications.length} {jobApplications.length === 1 ? "applicant" : "applicants"} · {jobShortlisted} shortlisted</span></div>{jobApplications.length === 0 ? <p className="no-applicants">No applications yet. The right person may be just around the corner.</p> : jobApplications.map((application) => {
            const isShortlisted = application.status === "Shortlisted";
            return <article className="applicant-card" key={`${application.jobId}-${application.date}`}><div className="avatar applicant-avatar">{application.applicantName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</div><div className="applicant-details"><strong>{application.applicantName}</strong><a href={`mailto:${encodeURIComponent(application.email)}`}>{application.email}</a>{application.note && <p>{application.note}</p>}</div><span className={`status-pill ${isShortlisted ? "shortlisted-status" : ""}`}><i />{application.status}</span><button className={`shortlist-button ${isShortlisted ? "shortlisted-button" : ""}`} onClick={() => onUpdateApplicationStatus(job.id, application.date, isShortlisted ? "In review" : "Shortlisted")}>{isShortlisted ? "Remove shortlist" : "Shortlist"}</button></article>;
          })}</div>}
        </div>;
      })}</div>}
      <div className="employer-note"><Icon name="sparkles" size={18} /><p><strong>Good people are out there.</strong> Write a post that sounds like your team, not just a job description.</p></div>
    </section>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-panel" role="dialog" aria-modal="true">{children}</div></div>;
}

function ApplicationForm({ job, profile, onSubmit }: { job: Job; profile: Profile; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="form-content" onSubmit={onSubmit}><div className="modal-eyebrow">A GOOD FIRST STEP</div><h2>Apply to {job.company}<span className="modal-period">.</span></h2><p className="modal-lead">A little introduction goes a long way. You’ve got this.</p><div className="apply-job-preview"><div className={`company-logo ${job.logoClass}`}>{job.logo}</div><div><strong>{job.title}</strong><span>{job.company} · {job.location}</span></div></div><label>Your name<input name="name" defaultValue={profile.name} required /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label><label>A note for the team <span className="optional-label">Optional</span><textarea name="note" rows={4} placeholder="What caught your eye about this role?" /></label><button className="button-primary form-submit" type="submit">Send my application <Icon name="arrow" size={17} /></button><small className="form-footnote">Your profile details will be shared with this team.</small></form>;
}

function PostJobForm({ onSubmit, onCancel }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  return <form className="form-content" onSubmit={onSubmit}><div className="modal-eyebrow">GOOD PEOPLE START WITH GOOD POSTS</div><h2>Tell us about the role<span className="modal-period">.</span></h2><p className="modal-lead">The best job posts sound like the people behind them.</p><div className="form-grid"><label>Job title<input name="title" placeholder="e.g. Product Designer" required /></label><label>Company name<input name="company" placeholder="e.g. Studio North" required /></label></div><div className="form-grid"><label>Location<input name="location" placeholder="e.g. Brooklyn, NY" required /></label><label>Work arrangement<select name="workplace"><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label></div><div className="form-grid"><label>Job category<select name="category"><option>Design</option><option>Engineering</option><option>Marketing</option><option>Product</option><option>Operations</option><option>Sales</option></select></label><label>Employment type<select name="type"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></label></div><label>Salary range<input name="salary" placeholder="e.g. $100k – $130k" /></label><label>What will they work on?<textarea name="description" rows={3} placeholder="A few sentences about the role and your team..." required /></label><label>Skills (separate with commas)<input name="skills" placeholder="e.g. Research, Figma, Prototyping" /></label><div className="form-actions"><button type="button" className="cancel-button" onClick={onCancel}>Maybe later</button><button type="submit" className="button-primary"><Icon name="plus" size={17} /> Publish job</button></div></form>;
}

function ProfileForm({ profile, onSave }: { profile: Profile; onSave: (profile: Profile) => void }) {
  const [draft, setDraft] = useState(profile);
  const update = (field: keyof Profile, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  return <form className="form-content" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><div className="modal-eyebrow">THE PERSON BEHIND THE WORK</div><h2>Make it yours<span className="modal-period">.</span></h2><p className="modal-lead">A few thoughtful details help the right people find you.</p><label>Your name<input value={draft.name} onChange={(event) => update("name", event.target.value)} required /></label><label>Your headline<input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="What do you do, and what do you love?" required /></label><label>Location<input value={draft.location} onChange={(event) => update("location", event.target.value)} required /></label><label>A little about you<textarea rows={4} value={draft.about} onChange={(event) => update("about", event.target.value)} placeholder="Tell people what makes your work yours..." /></label><label>Your skills <span className="optional-label">Separate with commas</span><input value={draft.skills} onChange={(event) => update("skills", event.target.value)} placeholder="Design, research, collaboration..." /></label><button className="button-primary form-submit" type="submit">Save my profile <Icon name="check" size={17} /></button></form>;
}

export default App;
