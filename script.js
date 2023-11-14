function zapiszDane(form) {
  const nazwa = form.nazwa.value;
  const nrKonta = form.nrKonta.value;
  const nazwaSprzedanejWaluty = form.nazwaSprzedawanejWaluty.value;
  const IloscSprzedanejWaluty = form.iloscSprzedawanejWaluty.value;
  const nazwaKupowanejWaluty = form.nazwaKupowanejWaluty.value;
  const akceptacjaPolitykiSerwisu = form.akceptacjaPolitykiSerwisu.checked;

  if (nazwaSprzedanejWaluty === nazwaKupowanejWaluty) {
    form.reset();
    return;
  }

  const daneObiekt = {
    nazwa: nazwa,
    nrKonta: nrKonta,
    nazwaSprzedanejWaluty: nazwaSprzedanejWaluty,
    IloscSprzedanejWaluty: IloscSprzedanejWaluty,
    nazwaKupowanejWaluty: nazwaKupowanejWaluty,
    akceptacjaPolitykiSerwisu: akceptacjaPolitykiSerwisu,
  };

  handleCalculation(daneObiekt);

  calculate(daneObiekt).then((pr) => console.log(pr));

  form.reset();
}

const handleCalculation = async (daneObiekt) => {
  const IloscKupowanejWaluty = await calculate(daneObiekt);

  document
    .getElementById("exchange__result")
    .insertAdjacentHTML(
      "beforeend",
      generateExchangeResult({ ...daneObiekt, IloscKupowanejWaluty })
    );
};

const generateExchangeResult = (dane) => {
  return `
  <h2>Exchange result #${generateRandomNumber(10000)} </h2>
  <p>Selling currency: ${dane.nazwaSprzedanejWaluty}</p>
  <p>Selling value: ${dane.IloscSprzedanejWaluty}</p>
  <p>Buying currency: ${dane.nazwaKupowanejWaluty}</p>
  <p>Buying value: ${dane.IloscKupowanejWaluty.toFixed(2)}</p>
  
  `;
};

const generateRandomNumber = (limit) => {
  return Math.floor(Math.random() * limit) + 1;
};
const calculate = async (formData) => {
  if (formData.nazwaSprzedanejWaluty === "PLN") {
    const buyCurrencyRate = await fetchCurrencyRate(
      formData.nazwaKupowanejWaluty
    );
    return formData.IloscSprzedanejWaluty / buyCurrencyRate;
  }

  if (formData.nazwaKupowanejWaluty === "PLN") {
    const sellCurrencyRate = await fetchCurrencyRate(
      formData.nazwaSprzedanejWaluty
    );
    return formData.IloscSprzedanejWaluty * sellCurrencyRate;
  }

  const sellCurrencyRate = await fetchCurrencyRate(
    formData.nazwaSprzedanejWaluty
  );
  const buyCurrencyRate = await fetchCurrencyRate(
    formData.nazwaKupowanejWaluty
  );

  return (sellCurrencyRate / buyCurrencyRate) * formData.IloscSprzedanejWaluty;
};

const fetchCurrencyRate = async (currency) => {
  const response = await fetch(
    `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/?format=json`
  );
  const data = await response.json();

  return data.rates[0].mid;
};

const form = document.getElementById("sprzedazWalutyFormularz");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  zapiszDane(e.target);
});
