var nivo = 1;
var maxNivo = 10;
var brojKrugovaNivo = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
var vrijemeNivo = 20;
var vrijemeFaktor = 2.5;
var boje = ["red", "blue", "green", "yellow"];
var generiraniKrugovi = [];
var randBoja, novi;
var pozicijaKlikaZaDrag = [];
var brojacVremena;

const zapocniIgruLabel = "Započni igru";
const provjeriRezultatLabel = "Provjeri rezultat";
const pokusajPonovnoLabel = "Pokusaj ponovno";


function zapocniIgru() {
  var generirajKrugove = promijeniBotun();
  if (generirajKrugove) {
    generirajKrugoveNaRandomMjestima(brojKrugovaNivo[nivo - 1]);
  }
}

function promijeniBotun() {
  console.log(document.getElementById("startStop").innerText);
  let trenutniTekst = document.getElementById("startStop").innerText;
  if (trenutniTekst == zapocniIgruLabel) {
    resetirajIgru();
  } else if (trenutniTekst == provjeriRezultatLabel) {
    zavrsiNivo();
    return false;
  } else if (trenutniTekst == pokusajPonovnoLabel) {
    resetirajIgru();
  } else if (trenutniTekst == `Započni ${nivo + 1}. nivo`) {
    zapocniNoviNivo();
  }
  return true;
}

function resetirajIgru() {
  nivo = 1;
  var krugovi = document.getElementsByClassName('circle');
  while (krugovi.length > 0) {
    document.body.removeChild(krugovi[0]);
  }
  document.getElementById("startStop").innerText = provjeriRezultatLabel;
  document.getElementById('vrijeme').innerHTML = brojKrugovaNivo[nivo - 1] * vrijemeFaktor;
  brojacVremena = setInterval(odbrojavaj, 1000);
}

function zapocniNoviNivo() {
  nivo++;
  document.getElementById('nivo').innerHTML = nivo;
  var krugovi = document.getElementsByClassName('circle');
  while (krugovi.length > 0) {
    document.body.removeChild(krugovi[0]);
  }
  document.getElementById("startStop").innerText = provjeriRezultatLabel;
  document.getElementById('vrijeme').innerHTML = brojKrugovaNivo[nivo - 1] * vrijemeFaktor;
  brojacVremena = setInterval(odbrojavaj, 1000);
}

function zavrsiNivo() {
  clearInterval(brojacVremena);
  var rezultat = provjeriRezultat();
  if (rezultat == false) {
    alert('Nisi sve krugove stavio na dobro mjesto');
    document.getElementById('startStop').innerText = pokusajPonovnoLabel; 
  } else {
    if (nivo == maxNivo) {
      alert('Cestitam, zavrsio si igru');
      document.getElementById('startStop').innerText = zapocniIgruLabel;
    } else {
      alert('Bravo, mozes na iduci nivo');
      document.getElementById('startStop').innerText = `Započni ${nivo + 1}. nivo`;
    } 
  }
}

function generirajKrugoveNaRandomMjestima(brojKrugova) {
  console.log(`Generiran je ${brojKrugova} krugova`);
  for (var i = 0; i < brojKrugova; i++) {
    randBoja = Math.floor(Math.random() * 4);
    randLeft = Math.floor(Math.random() * 90); //kasnije primjenjujemo kao postotke
    randTop = Math.floor(Math.random() * 90); //kasnije primjenjujemo kao postotke
    novi = document.createElement("div");
    novi.style.backgroundColor = boje[randBoja];
    novi.style.position = "absolute";
    novi.style.left = `${randLeft}%`;
    novi.style.top = `${randTop}%`;
    novi.style.width = "60px";
    novi.style.height = "60px";
    novi.style.borderRadius = "50%";
    novi.classList.add("circle");

    if (novi.style.backgroundColor == "red") {
      novi.classList.add("red");
    } else if (novi.style.backgroundColor == "blue") {
      novi.classList.add("blue");
    } else if (novi.style.backgroundColor == "green") {
      novi.classList.add("green");
    } else {
      novi.classList.add("yellow");
    }

    novi.dragged = 0;
    novi.onmousedown = startDrag;

    document.body.appendChild(novi);
    generiraniKrugovi.push(novi);
  }
}

function provjeriRezultat() {
  var rectRed = document.getElementById('prvi').getBoundingClientRect();
  var rectBlue = document.getElementById('drugi').getBoundingClientRect();
  var rectGreen = document.getElementById('treci').getBoundingClientRect();
  var rectYellow = document.getElementById('cetvrti').getBoundingClientRect();
  var redCircles = document.getElementsByClassName('red');
  var blueCircles = document.getElementsByClassName('blue');
  var greenCircles = document.getElementsByClassName('green');
  var yellowCircles = document.getElementsByClassName('yellow');

  if (provjeriPreklapanje(redCircles, rectRed) == false ||
      provjeriPreklapanje(blueCircles, rectBlue) == false ||
      provjeriPreklapanje(greenCircles, rectGreen) == false ||
      provjeriPreklapanje(yellowCircles, rectYellow) == false) {
      return false;
    }
  return true;
}

function provjeriPreklapanje(circles, rectangle) {
  for (i=0; i < circles.length; i++) {
    var circle = circles[i].getBoundingClientRect();
    if (rectangle.right < circle.left ||
        rectangle.left > circle.right ||
        rectangle.bottom < circle.top ||
        rectangle.top > circle.bottom) {
          return false;
        }
  }
  return true;
}

function gameOver() {
  document.getElementById("startStop").innerText = pokusajPonovnoLabel;
}

function odbrojavaj() {
  let trenutnoVrijeme = parseInt(document.getElementById("vrijeme").innerHTML);
  trenutnoVrijeme--;
  document.getElementById("vrijeme").innerHTML = trenutnoVrijeme;
  if (trenutnoVrijeme == 0) {
    clearInterval(brojacVremena);
    gameOver();
    alert("Kraj igre, isteklo vrijeme");
  }
}

function startDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // get the mouse cursor position at startup:
  pozicijaKlikaZaDrag[0] = e.clientX;
  pozicijaKlikaZaDrag[1] = e.clientY;
  ovaj = e.target;
  ovaj.dragged = 1;
  ovaj.onmousemove = elementDrag;
  ovaj.onmouseup = closeDrag;

  // zakrpa kada se prebrzo povuče pointer, pa se klik otpusti izvan samog elementa
  // tada ova funkcija ubija pomicanje elementa
  ovaj.onmouseout = closeDragFix;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  ovaj = e.target;
  if (ovaj.onmousemove == elementDrag && ovaj.dragged == 1) {
    // calculate the new cursor position:
    pozicijaKlikaZaDrag[2] = pozicijaKlikaZaDrag[0] - e.clientX;
    pozicijaKlikaZaDrag[3] = pozicijaKlikaZaDrag[1] - e.clientY;
    pozicijaKlikaZaDrag[0] = e.clientX;
    pozicijaKlikaZaDrag[1] = e.clientY;
    // set the element's new position:
    ovaj.style.top = ovaj.offsetTop - pozicijaKlikaZaDrag[3] + "px";
    ovaj.style.left = ovaj.offsetLeft - pozicijaKlikaZaDrag[2] + "px";
  }
}

function closeDrag(e) {
  // stop moving when mouse button is released:
  e = e || window.event;
  e.preventDefault();
  ovaj = e.target;
  ovaj.dragged = 0;
  ovaj.onmousemove = null;
  ovaj.onmouseup = null;
}

function closeDragFix(e) {
  // zakrpa kada se prebrzo povuče pointer, pa se klik otpusti izvan samog elementa
  // tada ova funkcija ubija pomicanje elementa
  e = e || window.event;
  e.preventDefault();
  ovaj = e.target;
  ovaj.dragged = 0;
  ovaj.onmousemove = null;
  ovaj.onmouseup = null;
}
