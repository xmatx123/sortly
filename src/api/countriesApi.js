// src/api/countriesApi.js

export const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    // Map the API data to match your application's structure
    const countries = data.map((country, index) => ({
      id: index + 1, // Assign a unique ID
      name: country.name.common || country.name.official,
      flagUrl: country.flags.svg || country.flags.png,
      population: country.population,
      area: country.area,
    }));

    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};
