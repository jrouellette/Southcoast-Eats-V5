"use client";

import { useMemo, useState } from "react";

type Restaurant = {
  id: number;
  name: string;
  neighborhood: string;
  cuisine: string;
  note: string;
  image: string;
  tags: string[];
  featured?: boolean;
};

const sampleRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Harbor & Hearth",
    neighborhood: "Sample listing · South Coast",
    cuisine: "New American",
    note: "A cozy coastal-inspired neighborhood spot.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=85",
    tags: ["Dinner", "Cozy"],
    featured: true,
  },
  {
    id: 2,
    name: "Little Bay Kitchen",
    neighborhood: "Sample listing · South Coast",
    cuisine: "Seafood",
    note: "A relaxed place for a fresh, casual meal.",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1100&q=85",
    tags: ["Lunch", "Seafood"],
    featured: true,
  },
  {
    id: 3,
    name: "The Olive Room",
    neighborhood: "Sample listing · South Coast",
    cuisine: "Mediterranean",
    note: "Bright flavors and an easygoing atmosphere.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=85",
    tags: ["Dinner", "Date night"],
    featured: true,
  },
  {
    id: 4,
    name: "Daybreak Café",
    neighborhood: "Sample listing · South Coast",
    cuisine: "Café",
    note: "A laid-back stop for coffee, breakfast, or a quick bite.",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=85",
    tags: ["Breakfast", "Coffee"],
  },
  {
    id: 5,
    name: "Juniper Table",
    neighborhood: "Sample listing · South Coast",
    cuisine: "Italian",
    note: "Comforting classics for an unhurried meal.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1100&q=85",
    tags: ["Dinner", "Comfort food"],
  },
  {
    id: 6,
    name: "Saltbox Tacos",
    neighborhood: "Sample listing · South Coast",
    cuisine: "Mexican",
    note: "Casual, colorful, and easy to make your own.",
    image:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1100&q=85",
    tags: ["Casual", "Quick bite"],
  },
];

const categories = ["All spots", "Seafood", "Café", "Italian", "Mexican", "Mediterranean"];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={filled ? "heart-filled" : ""}>
      <path d="M20.8 8.8c0 5.1-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All spots");
  const [saved, setSaved] = useState<number[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sampleRestaurants.filter((restaurant) => {
      const matchesCategory =
        activeCategory === "All spots" || restaurant.cuisine === activeCategory;
      const matchesQuery =
        !normalized ||
        [restaurant.name, restaurant.cuisine, restaurant.neighborhood, restaurant.note, ...restaurant.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesSaved = !showSaved || saved.includes(restaurant.id);
      return matchesCategory && matchesQuery && matchesSaved;
    });
  }, [query, activeCategory, showSaved, saved]);

  const featured = sampleRestaurants.filter((restaurant) => restaurant.featured);

  function toggleSaved(id: number) {
    setSaved((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]
    );
  }

  function scrollToExplore() {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        A fresh way to find local favorites
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="Southcoast Eats home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">southcoast<span>eats</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button className={!showSaved ? "nav-link active" : "nav-link"} onClick={() => { setShowSaved(false); scrollToExplore(); }}>
            Discover
          </button>
          <button className={showSaved ? "nav-link active" : "nav-link"} onClick={() => { setShowSaved(true); scrollToExplore(); }}>
            Saved <span className="saved-count">{saved.length}</span>
          </button>
        </nav>
        <button className="header-cta" onClick={scrollToExplore}>
          Explore spots <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> GOOD FOOD, CLOSE TO HOME</p>
          <h1>Find your<br /><em>next favorite.</em></h1>
          <p className="hero-description">
            Great places are closer than you think. Discover restaurants around the South Coast, one delicious find at a time.
          </p>
          <div className="hero-actions">
            <button className="button-primary" onClick={scrollToExplore}>Explore restaurants <span aria-hidden="true">→</span></button>
            <div className="location-note"><PinIcon /> The South Coast, Massachusetts</div>
          </div>
          <div className="hero-footnote">
            <span className="footnote-line" />
            Find a place for whatever you&apos;re craving.
          </div>
        </div>
        <div className="hero-visual" aria-label="Restaurant dining room photograph">
          <div className="hero-photo" />
          <div className="photo-caption">
            <span className="caption-icon">✳</span>
            <span><strong>Your next great meal</strong><small>Starts with a little exploring.</small></span>
          </div>
          <div className="floating-stamp"><span>LOCAL</span><span>FINDS</span><span className="stamp-star">✳</span></div>
        </div>
      </section>

      <section className="featured-section" aria-labelledby="featured-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A GOOD PLACE TO START</p>
            <h2 id="featured-title">A few spots to <em>love.</em></h2>
          </div>
          <button className="text-link" onClick={scrollToExplore}>Explore all spots <span aria-hidden="true">→</span></button>
        </div>
        <div className="featured-grid">
          {featured.map((restaurant, index) => (
            <article className="featured-card" key={restaurant.id}>
              <div className="card-image-wrap">
                <img src={restaurant.image} alt="" className="card-image" />
                <span className="sample-badge">Sample</span>
                <button
                  className={`save-button ${saved.includes(restaurant.id) ? "is-saved" : ""}`}
                  onClick={() => toggleSaved(restaurant.id)}
                  aria-label={saved.includes(restaurant.id) ? `Remove ${restaurant.name} from saved` : `Save ${restaurant.name}`}
                >
                  <HeartIcon filled={saved.includes(restaurant.id)} />
                </button>
              </div>
              <div className="card-content">
                <div className="card-kicker"><span>{restaurant.cuisine}</span><span className="kicker-dot">·</span><span>South Coast</span></div>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.note}</p>
                <button className="card-link" onClick={() => toggleSaved(restaurant.id)}>
                  {saved.includes(restaurant.id) ? "Saved for later" : "Save for later"} <span aria-hidden="true">{saved.includes(restaurant.id) ? "✓" : "↗"}</span>
                </button>
              </div>
              <span className="card-number">0{index + 1}</span>
            </article>
          ))}
        </div>
        <p className="sample-note">These are sample listings for the design preview, not verified restaurant records.</p>
      </section>

      <section className="explore-section" id="explore" aria-labelledby="explore-title">
        <div className="section-heading explore-heading">
          <div>
            <p className="eyebrow">YOUR NEXT BITE IS OUT THERE</p>
            <h2 id="explore-title">{showSaved ? "Your saved spots." : "What sounds good?"}</h2>
          </div>
          <p className="explore-intro">Search by name, cuisine, or craving.<br />Your next favorite is waiting.</p>
        </div>
        <div className="search-row">
          <label className="search-box">
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try seafood, coffee, date night..."
              aria-label="Search restaurants"
            />
            {query && <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          </label>
          <button className={`saved-filter ${showSaved ? "selected" : ""}`} onClick={() => setShowSaved(!showSaved)}>
            <HeartIcon filled={showSaved} /> Saved spots
          </button>
        </div>
        <div className="category-list" aria-label="Filter by cuisine">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-chip ${activeCategory === category ? "selected" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {filtered.length > 0 ? (
          <div className="explore-grid">
            {filtered.map((restaurant) => (
              <article className="mini-card" key={restaurant.id}>
                <div className="mini-image-wrap">
                  <img src={restaurant.image} alt="" className="mini-image" />
                  <button
                    className={`save-button ${saved.includes(restaurant.id) ? "is-saved" : ""}`}
                    onClick={() => toggleSaved(restaurant.id)}
                    aria-label={saved.includes(restaurant.id) ? `Remove ${restaurant.name} from saved` : `Save ${restaurant.name}`}
                  >
                    <HeartIcon filled={saved.includes(restaurant.id)} />
                  </button>
                </div>
                <div className="mini-card-copy">
                  <span className="mini-cuisine">{restaurant.cuisine}</span>
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.note}</p>
                  <span className="mini-location"><PinIcon /> South Coast · Sample listing</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">✳</span>
            <h3>{showSaved && saved.length === 0 ? "Nothing saved just yet." : "No spots found."}</h3>
            <p>{showSaved && saved.length === 0 ? "Tap the heart on a place you like and it’ll show up here." : "Try another search or choose a different cuisine."}</p>
            <button className="text-link" onClick={() => { setQuery(""); setActiveCategory("All spots"); setShowSaved(false); }}>Show all spots →</button>
          </div>
        )}
      </section>

      <section className="closing-banner">
        <div className="closing-mark">✳</div>
        <div><p className="eyebrow">GOOD THINGS ARE AROUND THE CORNER</p><h2>Go find your <em>somewhere.</em></h2></div>
        <button className="button-light" onClick={scrollToExplore}>Keep exploring <span aria-hidden="true">→</span></button>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#" aria-label="Southcoast Eats home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-name">southcoast<span>eats</span></span>
        </a>
        <p>Made for finding good food close to home.</p>
        <span className="footer-region">SOUTH COAST, MA</span>
      </footer>
    </main>
  );
}
