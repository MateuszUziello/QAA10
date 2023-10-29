import Notiflix from 'https://cdn.jsdelivr.net/npm/notiflix@3.2.6/+esm';
import lodashDebounce from 'https://cdn.jsdelivr.net/npm/lodash.debounce@4.0.8/+esm';
import { fetchCountries } from './fetchCountries.js';

const searchInput = document.querySelector('#search-box');
const resultsContainer = document.querySelector('#results');

const handleSearch = lodashDebounce(async () => {
  const searchValue = searchInput.value.trim();

  if (searchValue === '') {
    resultsContainer.innerHTML = '';
    return;
  }

  try {
    const countries = await fetchCountries(searchValue);

    if (countries.length === 0) {
      // Gdy nie znaleziono kraju
      Notiflix.Notify.failure('Oops, there is no country with that name');
    } else if (countries.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
      resultsContainer.innerHTML = '';
    } else if (countries.length >= 2 && countries.length <= 10) {
      const countryList = countries
        .map(
          country => `
          <div class="country">
            <h2>${country.name?.common || 'Unknown'}</h2>
            <p><strong>Capital:</strong> ${country.capital || 'Unknown'}</p>
            <p><strong>Population:</strong> ${
              country.population || 'Unknown'
            }</p>
            <p><strong>Flags:</strong> <img src="${
              country.flags?.svg || 'Unknown'
            }" alt="Flag"></p>
            <p><strong>Languages:</strong> ${
              country.languages
                ? Object.values(country.languages).join(', ')
                : 'Unknown'
            }</p>
          </div>
        `
        )
        .join('');

      resultsContainer.innerHTML = countryList;
    } else {
      const country = countries[0];
      resultsContainer.innerHTML = `
        <div class="country-info">
          <h2>${country.name?.common || 'Unknown'}</h2>
          <p><strong>Capital:</strong> ${country.capital || 'Unknown'}</p>
          <p><strong>Population:</strong> ${country.population || 'Unknown'}</p>
          <p><strong>Flags:</strong> <img src="${
            country.flags?.svg || 'Unknown'
          }" alt="Flag"></p>
          <p><strong>Languages:</strong> ${
            country.languages
              ? Object.values(country.languages).join(', ')
              : 'Unknown'
          }</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    // Obsługa błędu i wyświetlenie komunikatu
    Notiflix.Notify.failure('Oops, there was an error fetching data');
  }
}, 300);

searchInput.addEventListener('input', handleSearch);
