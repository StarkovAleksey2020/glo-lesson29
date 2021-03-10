window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const currencySelect = document.getElementById('currencySelect'),
    typeOfConvert = document.getElementById('currencyType'),
    currencyFirst = document.getElementById('currencyFirstValue'),
    currencySecond = document.getElementById('currencySecondValue'),
    currencyRate = document.getElementById('currencyRate'),
    convertButton = document.getElementById('convertCurrency'),
    currencyFirstItem = document.getElementById('currencyFirst'),
    currencySecondItem = document.getElementById('currencySecond');

  class Converter {
    constructor() {
      this.moneyValue = 0;
      this.moneyConverted = 0;
      this.rates = this.getRates();
      this.currentRate = 0;
      this.currentRateRUB = 0;
      this.currencyToRub = true;
    }

    getRates() {
      const fetchPromise = fetch("https://api.exchangeratesapi.io/latest");
      fetchPromise.then(response => {
        if (response.status !== 200) {
          throw new Error(`Status: ${response.statusText}. Code: ${response.status}.`);
        }
        return response.json();
      }).then(rates => {
        this.fillCurrencyList(rates.rates);
      });
    }

    fillCurrencyList(data) {
      for (let rate in data) {
        if (rate.toUpperCase() !== 'RUB') {
          this.addCurrencyItem(rate, data[rate]);
        } else if (rate.toUpperCase() === 'RUB') {
          this.currentRateRUB = data[rate];
        }
      }
    }

    addCurrencyItem(currency, rate) {
      currencySelect.insertAdjacentHTML('beforeend', `<option value='${rate * 10000}'>${currency}</option>`);
    }

    convert() {
      
    }

    showCurrency(currency, convertType) {
      if (convertType === 'currency-rub') {
        currencyFirstItem.textContent = currency;
        currencySecondItem.textContent = 'RUB';
        this.currencyToRub = true;
      } else if (convertType === 'rub-currency') {
        currencyFirstItem.textContent = 'RUB';
        currencySecondItem.textContent = currency;
        this.currencyToRub = false;
      }
    }

    prepareCalc() {
      const currency = currencySelect.options[currencySelect.selectedIndex].text;
      const convertType = typeOfConvert.value;
      const rateCurrency = (currencySelect.value / 10000).toFixed(4);
      this.currentRate = (this.currentRateRUB / rateCurrency).toFixed(4);
      this.showCurrency(currency, convertType);
    }

    eventsListeners() {
      currencySelect.addEventListener('change', () => {
        this.prepareCalc();
      });
      typeOfConvert.addEventListener('change', () => {
        if (currencySelect.value !== 'no') {
          this.prepareCalc();
        }
      });

      currencyFirst.addEventListener('input', () => {
        currencyFirst.value = currencyFirst.value.replace(/[^0-9]/g, '');
      });

      convertButton.addEventListener('click', () => {
        if (+currencyFirst.value > 0) {
          this.prepareCalc();
          if (this.currentRate === 'NaN') {
            alert('Select currency!');
          } else {
            if (this.currencyToRub) {
              currencySecond.value = Math.floor(currencyFirst.value * this.currentRate);
            } else {
              currencySecond.value = Math.floor(currencyFirst.value / this.currentRate);
            }
            currencyRate.value = this.currentRate;
          }
        }
      });
    }
  }
  
  const converter = new Converter();
  converter.eventsListeners();
});