// src/api/countriesApi.js

// Helper function to get the latest Gini value from the object
const getLatestGini = (giniObj) => {
  if (!giniObj || typeof giniObj !== 'object' || Object.keys(giniObj).length === 0) {
    return null;
  }
  // Find the latest year (key)
  const latestYear = Object.keys(giniObj).sort().pop();
  const giniValue = giniObj[latestYear];
  return typeof giniValue === 'number' ? giniValue : null;
};

export const fetchCountries = async () => {
  try {
    // Update URL to request specific fields, including gini
    const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,population,area,gini,unMember';
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from API');
    }

    // Filter to only include UN member states with valid data for ALL required fields
    const validCountries = data.filter((country) => {
      const latestGini = getLatestGini(country.gini); // Get latest Gini value
      return (
        country.unMember && 
        country.name?.common && 
        country.flags?.svg && 
        typeof country.population === 'number' && 
        typeof country.area === 'number' &&
        latestGini !== null // Check if we got a valid Gini number
      );
    });

    // Map the API data, including the extracted Gini value
    const countries = validCountries.map((country, index) => ({
      id: country.name.common, 
      name: country.name.common,
      flagUrl: country.flags.svg,
      population: country.population,
      area: country.area,
      gini: getLatestGini(country.gini), // Add latest Gini value here
    }));

    console.log(`Fetched ${countries.length} countries with valid Pop, Area, and Gini.`); // Log count

    // Add a check here to ensure we still have enough countries after filtering
    if (countries.length < 2) {
        console.warn('Fetched fewer than 2 countries with valid data including Gini.');
        // throw new Error('Insufficient country data available after filtering for Gini.');
    }

    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries data. Please try again later.');
  }
};
  