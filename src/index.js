import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const countryInfo = document.querySelector('div.country-info');
const inputField = document.querySelector('input#search-box');

const countryListener = () => {
  if (inputField.validity.patternMismatch === true) {
    countryInfo.innerHTML = '';
    return Notify.failure('Oops, use English letters only');
  }
  const country = inputField.value;
  if (country.length === 0) return (countryInfo.innerHTML = '');
  fetchCountries(country)
    .then(countries => {
      if (countries.length > 10)
        return Notify.info('Too many countries found. Be more specific!');
      if (countries.length === 1) return renderCountryCard(countries[0]);
      const oneCountry = countries.find(
        cName => cName.name.toLowerCase() === country.toLowerCase()
      );
      console.log(oneCountry);
      if (oneCountry) return renderCountryCard(oneCountry);
      return renderCountriesList(countries);
    })
    .catch(error => {
      countryInfo.innerHTML = '';
      Notify.failure('Oops, there is no country with that name', error);
    });
};

function renderCountriesList(countries) {
  const markup = countries
    .map(country => {
      return `  
      <div class=countries> 
       <img src="${country.flags.svg}" alt="${country.name} flag" width="40" >       
            ${country.name}</p>         
           
             </div>    
      `;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
function renderCountryCard(country) {
  const parsedLangs = country.languages.map(lang => lang.name).join(', ');
  const markup = ` <div class=country>       
  <img src="${country.flags.svg}" alt="${country.name} flag" width="40" >       
  ${country.name}</p>
            <b>Population</b>: ${country.population}</p>
            <b>Capital</b>: ${country.capital}</p>
             <b>Languages</b>: ${parsedLangs}</p>
             </div>
        
      `;
  countryInfo.innerHTML = markup;
}

inputField.addEventListener('input', debounce(countryListener, DEBOUNCE_DELAY));
