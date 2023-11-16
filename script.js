function saveDataFirstForm(form) {
  const names = form.names.value;
  const accountNumber = form.accountNumber.value;
  const SellCurrencyName = form.SellCurrencyName.value;
  const SellCurrencyAmount = form.SellCurrencyAmount.value;
  const BuyCurrencyName = form.BuyCurrencyName.value;
  const policyAcceptance = form.policyAcceptance.checked;

  if (SellCurrencyName === BuyCurrencyName || policyAcceptance === false) {
    form.reset();
    return;
  }

  const dataObject = {
    names: names,
    accountNumber: accountNumber,
    SellCurrencyName: SellCurrencyName,
    SellCurrencyAmount: SellCurrencyAmount,
    BuyCurrencyName: BuyCurrencyName,
    policyAcceptance: policyAcceptance,
  };

  handleCalculation(dataObject);

  calculate(dataObject).then((pr) => console.log(pr));

  form.reset();
  return;
}

const rateChangeResultContainer = document.getElementById("rate_change_result");

async function saveDataSecondForm(form) {
  const checkboxEUR = form.EURsecondForm;
  const checkboxCHF = form.GBPsecondForm;
  const checkboxGBP = form.CHFsecondForm;

  const currencies = [
    {
      code: "EUR",
      selected: checkboxEUR.checked,
    },
    {
      code: "CHF",
      selected: checkboxCHF.checked,
    },
    {
      code: "GBP",
      selected: checkboxGBP.checked,
    },
  ];

  rateChangeResultContainer.innerHTML = "";

  currencies.forEach(async (currency) => {
    if (currency.selected) {
      const rate = await fetchCurrencyRate(currency.code);
      rateChangeResultContainer.insertAdjacentHTML(
        "beforeend",
        generateCurrencyRateResult(currency.code, rate)
      );
    }
  });
  form2.reset();
}

const generateCurrencyRateResult = (currency, rate) =>
  `<h2>Kurs waluty #${generateRandomNumber(10000)} </h2>
  <p>${currency} Kurs na złoty polski: ${rate}</p>`;

const handleCalculation = async (dataObject) => {
  const BuyCurrencyAmount = await calculate(dataObject);

  document
    .getElementById("exchange__result")
    .insertAdjacentHTML(
      "beforeend",
      generateExchangeResult({ ...dataObject, BuyCurrencyAmount })
    );
};

const generateExchangeResult = (dane) => {
  return `
  <h2>Wymiana walut #${generateRandomNumber(10000)} </h2>
  <p>Waluta sprzedaż: ${dane.SellCurrencyName}</p>
  <p>Ilość sprzedanej waluty: ${dane.SellCurrencyAmount}</p>
  <p>Waluta kupno: ${dane.BuyCurrencyName}</p>
  <p>Ilość kupionej waluty: ${dane.BuyCurrencyAmount.toFixed(2)}</p>
  
  `;
};

const generateRandomNumber = (limit) => {
  return Math.floor(Math.random() * limit) + 1;
};
const calculate = async (formData) => {
  if (formData.SellCurrencyName === "PLN") {
    const buyCurrencyRate = await fetchCurrencyRate(formData.BuyCurrencyName);
    return formData.SellCurrencyAmount / buyCurrencyRate;
  }

  if (formData.BuyCurrencyName === "PLN") {
    const sellCurrencyRate = await fetchCurrencyRate(formData.SellCurrencyName);
    return formData.SellCurrencyAmount * sellCurrencyRate;
  }

  const sellCurrencyRate = await fetchCurrencyRate(formData.SellCurrencyName);
  const buyCurrencyRate = await fetchCurrencyRate(formData.BuyCurrencyName);

  return (sellCurrencyRate / buyCurrencyRate) * formData.SellCurrencyAmount;
};

const fetchCurrencyRate = async (currency) => {
  const response = await fetch(
    `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/?format=json`
  );
  const data = await response.json();

  return data.rates[0].mid;
};

const form = document.getElementById("sellCurrencyForm");
const form2 = document.getElementById("CheckRate");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveDataFirstForm(e.target);
});

form2.addEventListener("submit", (e) => {
  e.preventDefault();
  saveDataSecondForm(e.target);
});

function showMessage() {
  const text = document.getElementById("message");
  console.log(text);
  text.classList.remove("hidden");
}
