import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const ulListRef = document.querySelector('.country-list');
const divItemRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(evt) {
  const searchValue = evt.target.value.trim();
  if (searchValue !== '') {
    fetchCountries(searchValue)
      .then(renderCountries)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        console.log(error);
        divItemRef.innerHTML = '';
        ulListRef.innerHTML = '';
      });
  }
}

function renderCountries(countries) {
  const countriesNumber = countries.length;
  if (countriesNumber > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countriesNumber >= 2 && countriesNumber <= 10) {
    divItemRef.innerHTML = '';
    ulListRef.innerHTML = CountriesMarkup(countries);
  } else if (countriesNumber === 1) {
    ulListRef.innerHTML = '';
    divItemRef.innerHTML = oneCountryMarkup(countries);
  }
}

// function renderCountriesList(countries) {
//   ulListRef.innerHTML = CountriesMarkup(countries);
// }

// function renderCountryInfo(countries) {
//   divItemRef.innerHTML = oneCountryMarkup(countries);
// }

function CountriesMarkup(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
  <img
    class="country-list__image"
    src="${flags.svg}"
    alt="flag of${name}"
    width="40"
    height="30"
  />
  <p class="country-list__name">${name.official}</p>
</li>`;
    })
    .join('');
}

function oneCountryMarkup(countries) {
  return countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<img class="country-info__image" src="${
        flags.svg
      }" alt="flag of${name}" width="40" height="30" />
<h1 class="country-info__name">${name.official}</h1>
<p class="country-info__capital">Capital: ${capital}</p>
<p class="country-info__population">Population: ${population}</p>
<p class="country-info__languages">Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
}
