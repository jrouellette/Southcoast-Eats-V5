'use client';

import { useState } from 'react';

const cuisines = [
  { name: 'Seafood', icon: '🦞' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'American', icon: '🍔' },
  { name: 'Italian', icon: '🍝' },
  { name: 'Mexican', icon: '🌮' },
  { name: 'Asian', icon: '🍜' },
];

const restaurants = [
  {
    name: 'The Tipsy Seagull',
    cuisine: 'Seafood & American',
    town: 'Fall River',
    rating: '4.6',
    price: '$$',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80',
    note: 'Waterfront dining',
  },
  {
    name: 'Harbor & Hearth',
    cuisine: 'New American',
    town: 'New Bedford',
    rating: '4.8',
    price: '$$',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
    note: 'A local favorite',
  },
  {
    name: 'Little Italy',
    cuisine: 'Italian',
    town: 'Westport',
    rating: '4.5',
    price: '$$',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
    note: 'Comfort food',
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [saved, setSaved] = useState<string[]>([]);

  const visibleRestaurants = restaurants.filter((restaurant) => {
    const query = search.toLowerCase();

    const matchesSearch =
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query) ||
      restaurant.town.toLowerCase().includes(query);

    const matchesCuisine =
      !selectedCuisine ||
      restaurant.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()) ||
      (selectedCuisine === 'American' &&
        restaurant.cuisine.toLowerCase().includes('new american'));

    const matchesSaved =
      activeTab !== 'Saved' || saved.includes(restaurant.name);

    return matchesSearch && matchesCuisine && matchesSaved;
  });

  function toggleSaved(name: string) {
    setSaved((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setActiveTab('Home')}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="9" fill="#E9AE65" />
              <path
                d="M5 29C11 24 17 34 24 29C31 24 37 34 43 29"
                stroke="#247F83"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M5 37C11 32 17 42 24 37C31 32 37 42 43 37"
                stroke="#247F83"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-name">
            southcoast<span> eats</span>
          </span>
        </a>

        <button
          className="town-button"
          onClick={() => {
            const town = window.prompt('Which SouthCoast town are you exploring?');
            if (town) setSearch(town);
          }}
        >
          <span aria-hidden="true">📍</span> Choose town
          <span aria-hidden="true">⌄</span>
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">GOOD FOOD. LOCAL FINDS.</span>
          <h1>What’s good?</h1>
          <p>Find great food around the SouthCoast.</p>

          <form
            className="search-box"
            onSubmit={(event) => {
              event.preventDefault();
              setActiveTab('Explore');
            }}
          >
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search restaurants, cuisines, or towns"
              placeholder="Restaurants, cuisines, towns..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
            <button type="submit" className="search-submit">
              Find food
            </button>
          </form>
        </div>

        <div className="coastal-art" aria-hidden="true">
          <div className="sun" />
          <div className="dune dune-back" />
          <div className="dune dune-front" />
          <div className="sea sea-back" />
          <div className="sea sea-front" />
          <div className="lighthouse">
            <div className="light-top" />
            <div className="light-roof" />
            <div className="light-room" />
            <div className="light-body" />
            <div className="light-base" />
          </div>
          <div className="grass grass-one" />
          <div className="grass grass-two" />
        </div>
      </section>

      <section className="location-row">
        <button
          className="location-card"
          onClick={() => {
            if (!navigator.geolocation) {
              window.alert('Location is not available in this browser.');
              return;
            }

            navigator.geolocation.getCurrentPosition(
              () => window.alert('Location found! Nearby discovery is coming soon.'),
              () => window.alert('Location wasn’t available. Choose a town instead.'),
            );
          }}
        >
          <span className="location-icon">⌖</span>
          <span className="location-text">
            <strong>Use my current location</strong>
            <small>Discover places near you</small>
          </span>
          <span className="card-arrow">›</span>
        </button>

        <button
          className="location-card"
          onClick={() => {
            const town = window.prompt(
              'Enter a SouthCoast town, such as Fall River or Dartmouth.',
            );
            if (town) setSearch(town);
          }}
        >
          <span className="location-icon town-icon">⌂</span>
          <span className="location-text">
            <strong>Choose a town instead</strong>
            <small>Explore your favorite spots</small>
          </span>
          <span className="card-arrow">›</span>
        </button>
      </section>

      <section className="cuisine-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FOLLOW YOUR CRAVING</span>
            <h2>I’m craving...</h2>
          </div>
          <button
            className="text-link"
            onClick={() => {
              setSelectedCuisine('');
              setActiveTab('Explore');
            }}
          >
            All cuisines <span>→</span>
          </button>
        </div>

        <div className="cuisine-list">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.name}
              className={`cuisine-tile ${
                selectedCuisine === cuisine.name ? 'selected' : ''
              }`}
              onClick={() => {
                setSelectedCuisine((current) =>
                  current === cuisine.name ? '' : cuisine.name,
                );
                setActiveTab('Explore');
              }}
            >
              <span className="cuisine-icon">{cuisine.icon}</span>
              <span>{cuisine.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WORTH A LOOK</span>
            <h2>
              {activeTab === 'Saved'
                ? 'Your saved spots'
                : selectedCuisine
                  ? `${selectedCuisine} spots`
                  : search
                    ? 'Search results'
                    : 'Featured Near You'}
            </h2>
          </div>
          <button
            className="text-link"
            onClick={() => setActiveTab('Explore')}
          >
            Explore all <span>→</span>
          </button>
        </div>

        {visibleRestaurants.length > 0 ? (
          <div className="restaurant-list">
            {visibleRestaurants.map((restaurant) => (
              <article className="restaurant-card" key={restaurant.name}>
                <div className="restaurant-image-wrap">
                  <img
                    className="restaurant-image"
                    src={restaurant.image}
                    alt={`Dining atmosphere at ${restaurant.name}`}
                  />
                  <span className="restaurant-note">{restaurant.note}</span>
                  <button
                    className={`favorite-button ${
                      saved.includes(restaurant.name) ? 'is-saved' : ''
                    }`}
                    aria-label={
                      saved.includes(restaurant.name)
                        ? `Remove ${restaurant.name} from saved`
                        : `Save ${restaurant.name}`
                    }
                    onClick={() => toggleSaved(restaurant.name)}
                  >
                    {saved.includes(restaurant.name) ? '♥' : '♡'}
                  </button>
                </div>

                <div className="restaurant-info">
                  <div className="restaurant-title-row">
                    <h3>{restaurant.name}</h3>
                    <span className="rating">
                      <span>★</span> {restaurant.rating}
                    </span>
                  </div>
                  <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                  <div className="restaurant-meta">
                    <span>📍 {restaurant.town}</span>
                    <span>{restaurant.price}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>🍽️</span>
            <h3>No spots found just yet</h3>
            <p>Try another search or explore a different cuisine.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCuisine('');
                setActiveTab('Home');
              }}
            >
              Start fresh
            </button>
          </div>
        )}

        <p className="sample-note">
          Preview listings for design purposes. Restaurant details have not yet
          been verified.
        </p>
      </section>

      <footer className="footer">
        <span className="footer-brand">Southcoast Eats</span>
        <span>Good food, close to home.</span>
      </footer>

      <nav className="bottom-nav" aria-label="Main navigation">
        {[
          { label: 'Home', icon: '⌂' },
          { label: 'Explore', icon: '⌕' },
          { label: 'Saved', icon: '♡' },
          { label: 'Profile', icon: '○' },
        ].map((item) => (
          <button
            key={item.label}
            className={`nav-item ${
              activeTab === item.label ? 'active' : ''
            }`}
            onClick={() => {
              setActiveTab(item.label);
              if (item.label === 'Profile') {
                window.alert('Your profile will be available in a future update.');
              }
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
