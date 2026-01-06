// src/pages/HomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4'; // Import ReactGA
import SEO from '../components/SEO';
import populationImage from '../assets/population.jpg';
import areaImage from '../assets/area.jpg';
import giniImage from '../assets/gini.jpg'; // Renamed from gdpImage
import './HomePage.css';

// Helper function to capitalize
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

function HomePage() {
  const navigate = useNavigate();

  // Generalized handler function
  const handlePlay = (category, mode) => {
    const modeLabel = mode === 'battleRoyale' ? 'Battle Royale' : capitalize(mode);
    const categoryLabel = capitalize(category);
    const path = `/game/${category}/${mode}`;

    console.log(`Navigating to: ${path}`); // For debugging
    ReactGA.event({
      category: 'Game Navigation', // Updated category
      action: `Clicked Play ${categoryLabel} ${modeLabel}`,
      label: `${categoryLabel} - ${modeLabel}`
    });

    // For classic mode, navigate directly to the game page
    // For coop/battle, navigate to the lobby first
    if (mode === 'classic') {
      // Pass category in state for ClassicMode component (as it doesn't use lobbyId)
      navigate(path, { state: { category } });
    } else if (mode === 'cooperation' || mode === 'battleroyale') {
      // Lobby route is now /game/:category/:mode (coop/battle)
      navigate(path);
    } else {
      console.error("Unknown mode for navigation:", mode);
    }
  };

  // Define categories and modes for easier rendering
  const categories = [
    { name: 'population', image: populationImage },
    { name: 'area', image: areaImage },
    { name: 'gini', image: giniImage },
  ];
  const modes = ['classic', 'cooperation', 'battleroyale'];

  return (
    <div className="homepage">
      <SEO
        title="Sortly - Interactive Country Sorting Game"
        description="Challenge yourself sort countries by population, area, or Gini index. Test your geography knowledge with Sortly!"
        keywords="sortly, geography game, sort countries, population, area, gini index, educational game"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Sortly",
          "applicationCategory": "Game",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Sortly",
            "url": "https://sortly.de",
            "logo": {
              "@type": "ImageObject",
              "url": "https://sortly.de/logo512.png"
            }
          }
        }}
      />
      {categories.map(cat => (
        <div
          key={cat.name}
          className={`section ${cat.name}-section`}
          style={{
            backgroundImage: `url(${cat.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="overlay">
            <h2>Sort by {capitalize(cat.name)}</h2>
            <div className={`mode-buttons ${cat.name}-modes`}>
              {modes.map(mode => (
                <button
                  key={mode}
                  className="button button-primary"
                  onClick={() => handlePlay(cat.name, mode)}
                >
                  {mode === 'battleroyale' ? 'Battle Royale' : capitalize(mode)} Mode
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
