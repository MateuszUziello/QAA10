export async function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';

  const url = `${BASE_URL}${name}?fields=name,capital,population,flags,languages,population,flags`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching countries:', error);
      throw error;
    });
}
