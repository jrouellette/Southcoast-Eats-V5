"use client";

import { useMemo, useState } from "react";

const cuisines = [
  { name: "Seafood", emoji: "🦞" },
  { name: "Pizza", emoji: "🍕" },
  { name: "American", emoji: "🍔" },
  { name: "Italian", emoji: "🍝" },
  { name: "Mexican", emoji: "🌮" },
  { name: "Asian", emoji: "🍣" },
];

const restaurants = [
  {
    name: "The Black Whale",
    town: "New Bedford",
    cuisine: "Seafood",
    rating: "4.7",
    price: "$$",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pour Farm Tavern",
    town: "Fall River",
    cuisine: "American",
    rating: "4.5",
    price: "$$",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Nonni's Table",
    town: "Dartmouth",
    cuisine: "Italian",
    rating: "4.6",
    price: "$$",
    image: "https://images.unsplash.com/photo- pasta-placeholder?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Home");

  const visibleRestaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) =>
      (!activeCuisine || r.cuisine === activeCuisine) &&
      (!q || `${r.name} ${r.town} ${r.cuisine}`.toLowerCase().includes(q))
    );
  }, [query, activeCuisine]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="icon-button menu-button" aria-label="Menu">☰</button>
        <a className="brand" href="#" aria-label="SouthCoast Eats home">
          <span className="brand-mark">☀</span>
          <span className="brand-copy">
            <strong>SouthCoast <i>Eats</i></strong>
            <small>LOCAL PICKS. BETTER MEALS.</small>
          </span>
        </a>
        <button className="icon-button" aria-label="Search" onClick={() => document.getElementById("search")?.focus()}>⌕</button>
      </header>

      <section className="hero">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">YOUR LOCAL FOOD GUIDE</p>
          <h1>What’s good?</h1>
          <p className="hero-subtitle">Find great food around the SouthCoast.</p>
          <label className="search-box" htmlFor="search">
            <span aria-hidden="true">⌕</span>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try “seafood near me” or search a town'
            />
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>×</button>
          </label>
        </div>
      </section>

      <section className="location-actions" aria-label="Find restaurants">
        <button className="location-primary" onClick={() => alert("Location search can be connected to your device location in the next build.")}>
          <span className="action-icon">➤</span>
          <span><strong>Use my current location</strong><small>Find what’s open near you</small></span>
          <b>›</b>
        </button>
        <button className="location-secondary" onClick={() => setQuery("")}>
          <span className="pin-icon">●</span>
          <span><strong>Choose a town instead</strong><small>Search our SouthCoast and East Bay towns</small></span>
          <b>›</b>
        </button>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>I’m craving...</h2>
          <button onClick={() => setActiveCuisine("")}>See all <span>›</span></button>
        </div>
        <div className="cuisine-grid">
          {cuisines.map((c) => (
            <button
              className={`cuisine-tile ${activeCuisine === c.name ? "selected" : ""}`}
              key={c.name}
              onClick={() => setActiveCuisine(activeCuisine === c.name ? "" : c.name)}
              aria-pressed={activeCuisine === c.name}
            >
              <span className="cuisine-emoji">{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block featured-block">
        <div className="section-heading">
          <div><h2>Featured Near You</h2><p>Top picks from our local recommendation engine.</p></div>
          <button onClick={() => { setActiveCuisine(""); setQuery(""); }}>See more <span>›</span></button>
        </div>
        <div className="restaurant-scroller">
          {visibleRestaurants.length ? visibleRestaurants.map((r) => (
            <article className="restaurant-card" key={r.name}>
              <div className="restaurant-image-wrap">
                <img src={r.image.includes("pasta-placeholder") ? "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80" : r.image} alt={`${r.cuisine} food at ${r.name}`} loading="lazy" />
                <button
                  className={`save-button ${saved.includes(r.name) ? "is-saved" : ""}`}
                  aria-label={saved.includes(r.name) ? `Unsave ${r.name}` : `Save ${r.name}`}
                  onClick={() => setSaved((old) => old.includes(r.name) ? old.filter((n) => n !== r.name) : [...old, r.name])}
                >{saved.includes(r.name) ? "♥" : "♡"}</button>
              </div>
              <div className="restaurant-info">
                <h3>{r.name}</h3>
                <p>{r.cuisine} <span>·</span> {r.town}</p>
                <div className="restaurant-meta"><span>★ {r.rating}</span><span>·</span><span>{r.price}</span></div>
              </div>
            </article>
          )) : <p className="empty-state">No sample restaurants match that search. Try another town or cuisine.</p>}
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Main navigation">
        {[
          ["Home", "⌂"], ["Explore", "◎"], ["Saved", "♡"], ["Profile", "♙"],
        ].map(([name, icon]) => (
          <button key={name} className={activeTab === name ? "active" : ""} onClick={() => setActiveTab(name)}>
            <span>{icon}</span><small>{name}</small>
          </button>
        ))}
      </nav>
    </main>
  );
}
