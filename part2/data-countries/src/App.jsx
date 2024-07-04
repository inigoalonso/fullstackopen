import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_OPENWEATHERMAP_KEY;

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

  useEffect(() => {
    if (selectedCountry) {
      getWeather(selectedCountry.capital);
    }
  }, [selectedCountry]);

  const getWeather = (capital) => {
    if (capital) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error('Error getting the weather info:', error);
        });
    }
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleShowCountry = country => {
    setSelectedCountry(country);
    getWeather(country.capital);
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
            <li key={country.cca3}>{country.name.common} <button onClick={() => handleShowCountry(country)}>Show</button></li>
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
          {weather && (
            <div>
              <h2>Weather in {selectedCountry.capital}</h2>
              <p>temperature {weather.main.temp} C</p>
              <p>weather description: {weather.weather[0].description}</p>
              <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} />
              <p>wind {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
