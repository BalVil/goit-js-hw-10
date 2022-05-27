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

  cleaInnerEl(ulListRef);
  cleaInnerEl(divItemRef);

  if (searchValue !== '') {
    fetchCountries(searchValue)
      .then(renderCountries)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        console.log(error);
      });
  }
}

function cleaInnerEl(ref) {
  ref.innerHTML = '';
}

function renderCountries(countries) {
  const countriesNumber = countries.length;

  if (countriesNumber === 1) {
    cleaInnerEl(ulListRef);
    createCountryInfo(countries);
  } else if (countriesNumber > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else {
    cleaInnerEl(divItemRef);
    createCountriesList(countries);
  }
}

function createCountriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
  <img
    class="country-list__image"
    src="${flags.svg}"
    alt="flag of${name}"
    width="30"
    height="30"
  />
  <p class="country-list__name">${name.official}</p>
</li>`;
    })
    .join('');
  ulListRef.innerHTML = markup;
}

function createCountryInfo(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-info__wrap">
  <img
    class="country-info__image"
    src="${flags.svg}"
    alt="flag of ${name.official}"
    width="30"
    height="30"
  />
  <h1 class="country-info__name">${name.official}</h1>
</div>
<ul class="country-info__list">
  <li class="country-info__item"><span class="country-info__text">Capital:</span> ${capital}</li>
  <li class="country-info__item"><span class="country-info__text">Population:</span> ${population}
  </li>
  <li class="country-info__item">
    <span class="country-info__text">Languages:</span> ${Object.values(languages).join(', ')}
  </li>
</ul>`;
    })
    .join('');
  divItemRef.innerHTML = markup;
}
