function zapiszDane() {
  var nazwa = document.getElementById("nazwa").value;
  var nrKonta = document.getElementById("NrKonta").value;
  var nazwaSprzedanejWaluty = document.getElementById(
    "nazwaSprzedawanejWaluty"
  ).value;
  var IloscSprzedanejWaluty = document.getElementById(
    "IloscSprzedanejWaluty"
  ).value;
  var nazwaKupowanejWaluty = document.getElementById(
    "nazwaKupowanejWaluty"
  ).value;
  var akceptacjaPolitykiSerwisu = document.getElementById(
    "akceptacjaPolitykiSerwisu"
  ).value;

  var daneObiekt = {
    nazwa: nazwa,
    nrKonta: nrKonta,
    nazwaSprzedanejWaluty: nazwaSprzedanejWaluty,
    IloscSprzedanejWaluty: IloscSprzedanejWaluty,
    nazwaKupowanejWaluty: nazwaKupowanejWaluty,
    akceptacjaPolitykiSerwisu: akceptacjaPolitykiSerwisu,
  };

  console.log(daneObiekt);

  document.getElementById("sprzedazWalutyFormularz").reset();
}

fetch("https://api.nbp.pl/api/exchangerates/rates/A/EUR/?format=json")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);
  });
