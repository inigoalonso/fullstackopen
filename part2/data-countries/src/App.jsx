import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchQuery) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filteredCountries.length > 10) {
            setError('Too many matches, specify another filter');
            setCountries([]);
            setSelectedCountry(null);
          } else if (filteredCountries.length > 1) {
            setError('');
            setCountries(filteredCountries);
            setSelectedCountry(null);
          } else if (filteredCountries.length === 1) {
            setError('');
            setCountries([]);
            setSelectedCountry(filteredCountries[0]);
          } else {
            setError('No matches found');
            setCountries([]);
            setSelectedCountry(null);
          }
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
        });
    }
  }, [searchQuery]);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <form>
        find countries <input value={searchQuery} onChange={handleSearchChange} />
      </form>
      {error && <p>{error}</p>}
      {countries.length > 1 && (
        <ul>
          {countries.map(country => (
            <li key={country.cca3}>{country.name.common}</li>
          ))}
        </ul>
      )}
      {selectedCountry && (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>capital {selectedCountry.capital}</p>
          <p>area {selectedCountry.area} km^2</p>
          <p>Languages:</p>
          {/* now languages as a ul list */}
          <ul>
            {Object.values(selectedCountry.languages).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={selectedCountry.flags.svg} alt={`Flag of ${selectedCountry.name.common}`} width="150" />
        </div>
      )}
    </div>
  );
};

export default App;
