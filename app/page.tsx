"use client";

import { useMemo, useState } from "react";

const cuisines = [
  { name: "American", emoji: "♨", tone: "sage" },
  { name: "Pizza", emoji: "◉", tone: "blue" },
  { name: "Seafood", emoji: "🐟", tone: "yellow" },
  { name: "Burgers", emoji: "☰", tone: "coral" },
];

const restaurants = [
  { name: "The Black Whale", town: "New Bedford", cuisine: "Seafood", rating: "4.7", distance: "0.8 mi", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=85" },
  { name: "Pour Farm Tavern", town: "Fall River", cuisine: "American", rating: "4.5", distance: "1.2 mi", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85" },
  { name: "Nonni's Table", town: "Dartmouth", cuisine: "Italian", rating: "4.6", distance: "1.1 mi", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85" },
  { name: "The Mooring", town: "Newport", cuisine: "Seafood", rating: "4.6", distance: "1.3 mi", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=85" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Home");
  const visibleRestaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => (!activeCuisine || r.cuisine === activeCuisine) && (!q || `${r.name} ${r.town} ${r.cuisine}`.toLowerCase().includes(q)) && (activeTab !== "Saved" || saved.includes(r.name)));
  }, [query, activeCuisine, activeTab, saved]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Southcoast Eats home">
  <img
    className="brand-logo"
    src="/images/southcoast-eats-logo.png"
    alt="Southcoast Eats"
  />
</a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {["Home", "Search", "Saved", "More"].map((item) => <button key={item} className={activeTab === item ? "nav-active" : ""} onClick={() => { setActiveTab(item); if (item === "Search") document.getElementById("restaurant-search")?.focus(); }}>{item}</button>)}
        </nav>
      </header>

      <section className="hero" id="top" aria-label="Newport Pell Bridge at sunset">
        <h1 className="hero-tagline">Find Your Next Favorite</h1>
        <div className="location-search">
          <span className="pin" aria-hidden="true">●</span><button className="location-choice" onClick={() => setQuery("")}>Newport, RI <span>⌄</span></button>
          <label className="search-label" htmlFor="restaurant-search"><span aria-hidden="true">⌕</span><input id="restaurant-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search restaurants or towns" /></label>
        </div>
      </section>

      <section className="cuisine-grid" aria-label="Browse by food type">
        {cuisines.map((c) => <button key={c.name} className={`cuisine-tile ${c.tone} ${activeCuisine === c.name ? "selected" : ""}`} onClick={() => setActiveCuisine(activeCuisine === c.name ? "" : c.name)} aria-pressed={activeCuisine === c.name}><span className="cuisine-icon">{c.emoji}</span><span>{c.name}</span></button>)}
      </section>

      <section className="section-block featured-block">
        <div className="section-heading"><div><h1>{activeTab === "Saved" ? "Your Saved Places" : "Featured Restaurants"}</h1><p>Good local food, worth discovering.</p></div><button className="see-all" onClick={() => { setActiveCuisine(""); setQuery(""); setActiveTab("Home"); }}>See all <span>›</span></button></div>
        <div className="restaurant-grid">
          {visibleRestaurants.length ? visibleRestaurants.map((r) => <article className="restaurant-card" key={r.name}>
            <div className="restaurant-image-wrap"><img src={r.image} alt={`${r.cuisine} at ${r.name}`} loading="lazy"/><button className={`save-button ${saved.includes(r.name) ? "is-saved" : ""}`} aria-label={saved.includes(r.name) ? `Unsave ${r.name}` : `Save ${r.name}`} onClick={() => setSaved((old) => old.includes(r.name) ? old.filter((n) => n !== r.name) : [...old, r.name])}>{saved.includes(r.name) ? "♥" : "♡"}</button></div>
            <div className="restaurant-info"><h2>{r.name}</h2><div className="restaurant-meta"><strong>★ {r.rating}</strong><span>·</span><span>{r.distance}</span></div><p>{r.town}, RI</p></div>
          </article>) : <p className="empty-state">No places match yet. Try another search or food category.</p>}
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Main navigation">{[["Home", "⌂"], ["Search", "⌕"], ["Saved", "♡"], ["More", "☰"]].map(([name, icon]) => <button key={name} className={activeTab === name ? "active" : ""} onClick={() => { setActiveTab(name); if (name === "Search") document.getElementById("restaurant-search")?.focus(); }}><span>{icon}</span><small>{name}</small></button>)}</nav>
      <footer className="site-footer">Southcoast Eats · Discover local, eat well.</footer>
    </main>
  );
}
