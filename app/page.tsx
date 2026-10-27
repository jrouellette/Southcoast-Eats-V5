'use client';

import { useMemo, useState } from 'react';

const cuisines = [
  { name: 'Seafood', icon: '🦞' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'American', icon: '🍔' },
  { name: 'Italian', icon: '🍝' },
  { name: 'Mexican', icon: '🌮' },
  { name: 'Asian', icon: '🍣' },
];

const restaurants = [
  { name: 'The Black Whale', cuisine: 'Seafood', town: 'New Bedford', rating: '4.7', price: '$$', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=85', note: 'A local favorite for fresh seafood' },
  { name: 'Pour Farm Tavern', cuisine: 'American', town: 'Fall River', rating: '4.5', price: '$$', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85', note: 'Comfort food and neighborhood vibes' },
  { name: 'The Pasta House', cuisine: 'Italian', town: 'Dartmouth', rating: '4.6', price: '$$', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85', note: 'A cozy table for any occasion' },
  { name: 'Coastal Taco', cuisine: 'Mexican', town: 'Westport', rating: '4.4', price: '$', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=85', note: 'Fresh flavors, easygoing atmosphere' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [saved, setSaved] = useState<string[]>([]);
  const [town, setTown] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleRestaurants = useMemo(() => restaurants.filter((r) => {
    const q = search.trim().toLowerCase();
    const searchMatch = !q || [r.name, r.cuisine, r.town].some((v) => v.toLowerCase().includes(q));
    const cuisineMatch = !selectedCuisine || r.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
    const savedMatch = activeTab !== 'Saved' || saved.includes(r.name);
    return searchMatch && cuisineMatch && savedMatch;
  }), [search, selectedCuisine, activeTab, saved]);

  function chooseTown() {
    const value = window.prompt('Which SouthCoast or East Bay town would you like to explore?', town || '');
    if (value !== null && value.trim()) {
      setTown(value.trim());
      setSearch(value.trim());
      setActiveTab('Explore');
    }
  }

  function selectCuisine(name: string) {
    setSelectedCuisine((current) => current === name ? '' : name);
    setActiveTab('Explore');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="icon-button menu-button" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Home'); setSearch(''); setSelectedCuisine(''); }}>
          <span className="brand-art" aria-hidden="true">
            <svg viewBox="0 0 84 54" fill="none"><circle cx="25" cy="18" r="13" fill="#F4B33E"/><path d="M5 31C19 20 27 34 42 27S62 23 78 13" stroke="#2B8192" strokeWidth="7" strokeLinecap="round"/><path d="M4 38C18 27 28 41 43 34S64 30 79 20" stroke="#76BFC4" strokeWidth="5" strokeLinecap="round"/><path d="M7 45C21 34 31 48 46 41S66 37 78 29" stroke="#1C557A" strokeWidth="4" strokeLinecap="round"/></svg>
          </span>
          <span className="brand-wordmark"><span>SouthCoast</span> <em>Eats</em><small>LOCAL PICKS. BETTER MEALS.</small></span>
        </a>
        <button className="icon-button header-search" aria-label="Focus search" onClick={() => document.getElementById('restaurant-search')?.focus()}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
        </button>
      </header>

      {menuOpen && <div className="menu-popover"><button onClick={() => { setActiveTab('Home'); setMenuOpen(false); }}>Home</button><button onClick={() => { setActiveTab('Explore'); setMenuOpen(false); }}>Explore restaurants</button><button onClick={() => { setActiveTab('Saved'); setMenuOpen(false); }}>Saved places</button><button onClick={() => { chooseTown(); setMenuOpen(false); }}>Choose a town</button></div>}

      <section className="hero">
        <div className="hero-photo" role="img" aria-label="SouthCoast beach with dunes and ocean" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <h1>What’s good?</h1>
          <p>Find great food around the SouthCoast.</p>
          <form className="search-box" onSubmit={(e) => { e.preventDefault(); setActiveTab('Explore'); }}>
            <svg className="search-symbol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
            <input id="restaurant-search" aria-label="Search restaurants, cuisines, or towns" placeholder="Try “seafood near me” or search a town" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="button" className="mic-button" aria-label="Voice search is not available yet" onClick={() => window.alert('Voice search is coming soon. You can type your search here.')}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-4 0h8"/></svg>
            </button>
          </form>
        </div>
      </section>

      <section className="location-actions" aria-label="Choose your location">
        <button className="location-card primary-location" onClick={() => {
          if (!navigator.geolocation) { chooseTown(); return; }
          navigator.geolocation.getCurrentPosition(() => window.alert('Location access is ready. Nearby restaurant matching will be connected when verified restaurant data is added.'), () => chooseTown());
        }}>
          <span className="location-symbol"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z"/></svg></span>
          <span className="location-copy"><strong>Use my current location</strong><small>Find what’s open near you</small></span><span className="location-arrow">›</span>
        </button>
        <button className="location-card town-location" onClick={chooseTown}>
          <span className="location-symbol"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
          <span className="location-copy"><strong>Choose a town instead</strong><small>{town || 'Search our SouthCoast and East Bay towns'}</small></span><span className="location-arrow">›</span>
        </button>
      </section>

      <section className="cuisine-section">
        <div className="section-heading"><h2>I’m craving...</h2><button className="section-link" onClick={() => { setSelectedCuisine(''); setActiveTab('Explore'); }}>See all <span>›</span></button></div>
        <div className="cuisine-list">
          {cuisines.map((c) => <button key={c.name} className={`cuisine-tile ${selectedCuisine === c.name ? 'selected' : ''}`} onClick={() => selectCuisine(c.name)}><span className="cuisine-illustration">{c.icon}</span><span>{c.name}</span></button>)}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading featured-heading"><div><h2>{activeTab === 'Saved' ? 'Your saved spots' : selectedCuisine ? `${selectedCuisine} spots` : search ? 'Search results' : 'Featured Near You'}</h2><p>{activeTab === 'Saved' ? 'Places you’ve saved for later.' : 'Explore local places to eat.'}</p></div><button className="section-link" onClick={() => { setActiveTab('Explore'); setSelectedCuisine(''); }}>See more <span>›</span></button></div>
        {visibleRestaurants.length ? <div className="restaurant-scroller">
          {visibleRestaurants.map((r) => <article className="restaurant-card" key={r.name}>
            <div className="restaurant-image-wrap"><img src={r.image} alt="" className="restaurant-image" loading="lazy"/><button className={`favorite-button ${saved.includes(r.name) ? 'is-saved' : ''}`} aria-label={saved.includes(r.name) ? 'Remove saved restaurant' : 'Save restaurant'} onClick={() => setSaved((items) => items.includes(r.name) ? items.filter((n) => n !== r.name) : [...items, r.name])}>{saved.includes(r.name) ? '♥' : '♡'}</button></div>
            <div className="restaurant-info"><h3>{r.name}</h3><p className="restaurant-location">{r.cuisine}<span>•</span>{r.town}</p><div className="restaurant-rating"><span className="star">★</span><strong>{r.rating}</strong><span>•</span><strong>{r.price}</strong></div><div className="restaurant-note"><span aria-hidden="true">✦</span>{r.note}</div></div>
          </article>)}
        </div> : <div className="empty-state"><span>🍽️</span><strong>No matches yet</strong><p>Try another town, cuisine, or search.</p><button onClick={() => { setSearch(''); setSelectedCuisine(''); setActiveTab('Home'); }}>Clear filters</button></div>}
        <p className="data-note">Preview listings only: restaurant details and ratings have not yet been verified.</p>
      </section>

      <nav className="bottom-nav" aria-label="Main navigation">
        {[{label:'Home',icon:'home'},{label:'Explore',icon:'compass'},{label:'Saved',icon:'heart'},{label:'Profile',icon:'user'}].map((item) => <button key={item.label} className={`nav-item ${activeTab === item.label ? 'active' : ''}`} onClick={() => { setActiveTab(item.label); if (item.label === 'Explore') document.querySelector('.featured-section')?.scrollIntoView({behavior:'smooth',block:'start'}); }}><svg viewBox="0 0 24 24" aria-hidden="true">{item.icon === 'home' && <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z"/>}{item.icon === 'compass' && <><circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3Z"/></>}{item.icon === 'heart' && <path d="M20.8 8.8c0 5.3-8.8 11-8.8 11S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/>}{item.icon === 'user' && <><circle cx="12" cy="7.5" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/></>}</svg><span>{item.label}</span></button>)}
      </nav>
    </main>
  );
}
