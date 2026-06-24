// Déclaration du graphique de chart.js pour pouvoir le nettoyer à chaque changement de slider
var chartGraphique = null;

// Sliders pour les valeurs qu'on peut sélectionner
const lambdaIsolant1Value = document.querySelector("#lambdaIsolant1Value");
const lambdaIsolant1 = document.querySelector("#lambdaIsolant1");
lambdaIsolant1Value.textContent = lambdaIsolant1.value;
lambdaIsolant1.addEventListener("input", (event) => {
  lambdaIsolant1Value.textContent = event.target.value;
  if (chartGraphique) {
    chartGraphique.clear();
    chartGraphique.destroy();
  }
  simulation();
});

const rhoCpIsolant1Value = document.querySelector("#rhoCpIsolant1Value");
const rhoCpIsolant1 = document.querySelector("#rhoCpIsolant1");
rhoCpIsolant1Value.textContent = rhoCpIsolant1.value;
rhoCpIsolant1.addEventListener("input", (event) => {
  rhoCpIsolant1Value.textContent = event.target.value;
  if (chartGraphique) {
    chartGraphique.clear();
    chartGraphique.destroy();
  }
  simulation();
});

const eIsolant1Value = document.querySelector("#eIsolant1Value");
const eIsolant1 = document.querySelector("#eIsolant1");
eIsolant1Value.textContent = eIsolant1.value;
eIsolant1.addEventListener("input", (event) => {
  eIsolant1Value.textContent = event.target.value;
  if (chartGraphique) {
    chartGraphique.clear();
    chartGraphique.destroy();
  }
  simulation();
});

const lambdaIsolant2Value = document.querySelector("#lambdaIsolant2Value");
const lambdaIsolant2 = document.querySelector("#lambdaIsolant2");
lambdaIsolant2Value.textContent = lambdaIsolant2.value;
lambdaIsolant2.addEventListener("input", (event) => {
  lambdaIsolant2Value.textContent = event.target.value;
  if (chartGraphique) {
    chartGraphique.clear();
    chartGraphique.destroy();
  }
  simulation();
});

const rhoCpIsolant2Value = document.querySelector("#rhoCpIsolant2Value");
const rhoCpIsolant2 = document.querySelector("#rhoCpIsolant2");
rhoCpIsolant2Value.textContent = rhoCpIsolant2.value;
rhoCpIsolant2.addEventListener("input", (event) => {
  rhoCpIsolant2Value.textContent = event.target.value;
  if (chartGraphique) {
    chartGraphique.clear();
    chartGraphique.destroy();
  }
  simulation();
});

const eIsolant2Value = document.querySelector("#eIsolant2Value");
const eIsolant2 = document.querySelector("#eIsolant2");
eIsolant2Value.textContent = eIsolant2.value;
eIsolant2.addEventListener("input", (event) => {
  eIsolant2Value.textContent = event.target.value;
  if (chartGraphique) {
    chartGraphique.clear();
    chartGraphique.destroy();
  }
  simulation();
});

// Fonctions utiles
function interpoler (Temps, premierTemps, premiereT, deuxiemeTemps, deuxiemeT) {
  let TResultat = 0;
  if (Temps == premierTemps) {
    TResultat = premiereT;
  } else if (Temps == deuxiemeTemps) {
    TResultat = deuxiemeT;
  } else {
    let fractionARajouter = Math.abs((premierTemps - Temps) / (premierTemps - deuxiemeTemps));
    let deltaEntreLesDeuxT = deuxiemeT - premiereT;
    TResultat = premiereT + (deltaEntreLesDeuxT * fractionARajouter);
  }
  // console.log(temps + ' , ' + premierTemps + ' , ' + premiereT + ' , ' + deuxiemeTemps + ' , ' + deuxiemeT + ' , ' + TResultat)
  return TResultat;
};

function equationDeLaChaleur (SsurRhoCP, dT, dX, alphaIsolant, T_isolant_tm1_x, T_isolant_tm1_xp1, T_isolant_tm1_xm1) {
  let T_resultat = T_isolant_tm1_x + SsurRhoCP * dT + dT * alphaIsolant * (T_isolant_tm1_xp1 + T_isolant_tm1_xm1 - 2 * T_isolant_tm1_x) / (dX * dX);
  console.log(T_resultat  + '  ' + SsurRhoCP + '  ' +  dT + '  ' +  dX + '  ' +  alphaIsolant + '  ' +  T_isolant_tm1_x + '  ' +  T_isolant_tm1_xp1 + '  ' +  T_isolant_tm1_xm1);
  return T_resultat;
};

// On déroule une fois la simulation après chargement de la page
window.onload = (event) => {
  simulation();
}

// Début de la simulation

function simulation () {

  // Constantes
  const P_SoleilMax = 803; // W/m² | = 1375 W/m² x 0,7 (absorption atmosphérique) x sin 68° (hauteur du soleil) x 0,9 (coeff absorption tuiles en ardoise)
  const T_ExtMin = 20 + 273.15; // K
  const T_ExtMax = 40 + 273.15; // K
  const T_IntInit = 20 + 273.15; // K
  const H_LeverSoleil = 6 * 3600; // 6:00
  const H_CoucherSoleil = 22 * 3600; // 22:00
  const SECDANSHEURE = 60 * 60;
  const SECDANSJOURS = 24 * SECDANSHEURE;
  const FINDUJOUR = SECDANSJOURS;
  // Cp de l'air = 1004 J/kg/K
  // Masse volumique de l'air sec à 1013 hPa = 1,292 x 273,15 / T (en kg/m3)
  // rhoCp de l'air sec = 1004 x 1,292 x 273,15 / T = 354 321,44 / T (en J/m3/K)
  const coeffRhoCpAirSec = 354321.44;
  // Donc pour 1m : rhoCp de l'air sec = coeffRhoCpAirSec / T
  // diffusivité thermique air = 20.10-6 m²/s
  const alphaAir = 20 * 10 ** -6;



  // Discrétisation
  const deltaT = 600; // secondes
  const deltaX = 0.01; // m
  const dureeTotaleEnJours = 2; // jours
  const dureeTotale = dureeTotaleEnJours * SECDANSJOURS; // secondes

  // Construction des tableaux de valeurs pour le temps et l'espace
  const temps = [];
  for (let t = 0; t <= dureeTotale; t = t + deltaT) {
    temps.push(t);
  }

  const xIsolant1 = [];
  for (let x = 0; x <= (eIsolant1Value.value / 1000); x = x + deltaX) { // conversion de eIsolant1Value en m
    xIsolant1.push(x);
  }

  const xIsolant2 = [];
  for (let x = 0; x <= (eIsolant1Value.value / 1000); x = x + deltaX) { // conversion de eIsolant2Value en m
    xIsolant2.push(x);
  }


  // Construction du tableau de valeurs pour la puissance du soleil
  const P_Soleil = [];
  for (let i = 0; i < temps.length; i++) {
      P_Soleil.push(0);
  }
  let indexTempsDebut = Math.floor(H_LeverSoleil / deltaT);
  let indexTempsFin = Math.floor(H_CoucherSoleil / deltaT);
  let deltaIndexJourSuivant = Math.floor(SECDANSJOURS / deltaT);
  for (let j = 1; j <= dureeTotaleEnJours; j++) {
    for (let i = indexTempsDebut; i <= indexTempsFin; i++) {
        P_Soleil.splice(i + (j - 1) * deltaIndexJourSuivant, 1, P_SoleilMax * Math.sin(Math.PI * ((H_CoucherSoleil - temps[i]) / (H_CoucherSoleil - H_LeverSoleil))));
    }
  }


  // Construction du tableau de valeurs pour la température (pour l'instant, juste une extraction de la journée du 26/05/2026, particulièrement chaude)
  // À terme on pourra construire quelque chose avec les heures de lever et de coucher du soleil, et les températures min et max
  // On le fait seulement sur une journée, puis on va jusqu'au nombre de jours souhaités dans un deuxième temps.
  const T_Ext_260526 = [[2,23.9],[5,21.3],[8,22.5],[11,27.8],[14,33.1],[17,34],[20,32.5],[23,26.3]]; // [heure en heure,T Celsius]
  // conversion de l'heure en secondes
  for (i = 0; i < T_Ext_260526.length; i++) {
    T_Ext_260526.splice(i, 1, [T_Ext_260526[i][0] * SECDANSHEURE,T_Ext_260526[i][1]]);
  }


  const T_Ext = [];
  for (let t = 0; t < temps.length; t++) {
    if (temps[t] <= FINDUJOUR) {
      let Tinterpolee = 0;
      // Trouver la valeur du tableau la plus proche
      let iTableauTempsPlusProche = 0;
      let ecartDeTemps = Math.abs(temps[t] - T_Ext_260526[0][0]);
      for (let i = 0; i < T_Ext_260526.length; i++) {
        let nouvelEcartDeTemps = Math.abs(temps[t] - T_Ext_260526[i][0]);
        if (nouvelEcartDeTemps < ecartDeTemps) {
          ecartDeTemps = nouvelEcartDeTemps;
          iTableauTempsPlusProche = i;
        }
      }
      // si la valeur la plus proche est supérieure, on interpole avec la précédente
      if (T_Ext_260526[iTableauTempsPlusProche][0] > temps[t]) {
        // dans ce cas, si on est sur la première valeur, on interpole avec la dernière
        if (iTableauTempsPlusProche == 0) {
          Tinterpolee = interpoler(temps[t], T_Ext_260526[T_Ext_260526.length - 1][0] - SECDANSJOURS, T_Ext_260526[T_Ext_260526.length - 1][1], T_Ext_260526[0][0], T_Ext_260526[0][1]);
        } else {
          Tinterpolee = interpoler(temps[t], T_Ext_260526[iTableauTempsPlusProche - 1][0], T_Ext_260526[iTableauTempsPlusProche - 1][1], T_Ext_260526[iTableauTempsPlusProche][0], T_Ext_260526[iTableauTempsPlusProche][1]);
        }
      } else {
        // sinon (valeur la plus proche est inférieure), on interpole avec la suivante
        // dans ce cas, si on est sur la dernière valeur, on interpole avec la première
        if (iTableauTempsPlusProche == (T_Ext_260526.length - 1)) {
          Tinterpolee = interpoler(temps[t], T_Ext_260526[iTableauTempsPlusProche][0], T_Ext_260526[iTableauTempsPlusProche][1], T_Ext_260526[0][0] + SECDANSJOURS, T_Ext_260526[0][1]);
        } else {
          Tinterpolee = interpoler(temps[t], T_Ext_260526[iTableauTempsPlusProche][0], T_Ext_260526[iTableauTempsPlusProche][1], T_Ext_260526[iTableauTempsPlusProche + 1][0], T_Ext_260526[iTableauTempsPlusProche + 1][1]);
        }
      }
      T_Ext.push(Tinterpolee + 273.15); // conversion en K
    }
  }
  // console.log(T_Ext);


  // Prolongement de l'échantillon des températures sur la durée totale souhaitée
  const T_ExtLength = T_Ext.length;
  for (let j = 1; j < dureeTotaleEnJours; j++) {
    for (let i = 0; i < T_ExtLength; i++) {
      // console.log(T_Ext[i]);
      T_Ext.push(T_Ext[i]);
    }
  }


  // Déclaration des variables pour le calcul avec l'équation de la chaleur
  const T_isolant1 = [];
  const T_isolant2 = [];
  const T_Int = [];
  let fluxChaleur_isolant1 = [];
  let fluxChaleur_isolant2 = [];

  // Initialisation des variables (t = 0)
  T_Int.push(T_IntInit);
  // Initialisation de la température de l'isolant avec la température intérieure initiale (t = 0)
  let T_isolant1_0 = [];
  for (let x = 0; x < xIsolant1.length; x++) {
    T_isolant1_0.push(T_IntInit);
  }
  let T_isolant2_0 = [];
  for (let x = 0; x < xIsolant2.length; x++) {
    T_isolant2_0.push(T_IntInit);
  }
  T_isolant1.push(T_isolant1_0);
  T_isolant2.push(T_isolant2_0);


  // Calcul des flux de chaleur
  // On a peut-être une génération spontanée de chaleur avec les interfaces, puisque je considère que la température du truc considéré est égale à celle du truc à la limite, et inversement, alors que les 2 valeurs ne sont peut-être pas égales.
  const alphaIsolant1 = lambdaIsolant1Value.value / rhoCpIsolant1Value.value; // diffusivité thermique isolant 1
  const alphaIsolant2 = lambdaIsolant2Value.value / rhoCpIsolant2Value.value; // diffusivité thermique isolant 2
  for (let t = 1; t < temps.length; t++) {
    // Cas général isolant 1 (équation de la chaleur sans S)
    let T_isolant1_t_x = [];
    for (let x = 1; x < xIsolant1.length - 1; x++) {
      T_isolant1_t_x.push(equationDeLaChaleur(0, deltaT, deltaX, alphaIsolant1, T_isolant1[t-1][x], T_isolant1[t-1][x+1], T_isolant1[t-1][x-1]));
      // T_isolant1_t_x.push(T_isolant1[t-1] + alphaIsolant1 * deltaT * (T_isolant1[t-1][x+1] + T_isolant1[t-1][x-1] - 2 * T_isolant1[t-1][x]) / (deltaX * deltaX));
    }
    // Cas général isolant 2 (équation de la chaleur sans S)
    let T_isolant2_t_x = [];
    for (let x = 1; x < xIsolant2.length - 1; x++) {
      T_isolant2_t_x.push(equationDeLaChaleur(0, deltaT, deltaX, alphaIsolant2, T_isolant2[t-1][x], T_isolant2[t-1][x+1], T_isolant2[t-1][x-1]));
    }
    // Cas limite tuile - isolant 1 (pour la tuile, si on veut faire fin on peut prendre 837 J/kg/K et 2,8 g/cm-3, mais là juste on néglige et on a déjà compté un coefficient d'absorption de 0,9)
    // (revient à une limite soleil - isolant 1, en comptant le coeff d'absorption de la tuile de 0,9)
    // Ça revient à avoir S = P_Soleil
    // console.log('1');
    let T_isolant1_t_ext = equationDeLaChaleur(P_Soleil[t-1] / rhoCpIsolant1Value.value, deltaT, deltaX, alphaIsolant1, T_isolant1[t-1][0], T_isolant1[t-1][1], T_Ext[t-1]);
    // Cas limite isolant 1 - isolant 2
    // console.log('2');
    let T_isolant1_t_isolant2 = equationDeLaChaleur(0, deltaT, deltaX, alphaIsolant1, T_isolant1[t-1][xIsolant1.length-1], T_isolant2[t-1][0], T_isolant1[t-1][xIsolant1.length-2]);
    // Cas limite isolant 2 - isolant 1
    // console.log('3');
    let T_isolant2_t_isolant1 = equationDeLaChaleur(0, deltaT, deltaX, alphaIsolant2, T_isolant2[t-1][0], T_isolant2[t-1][1], T_isolant1[t-1][xIsolant1.length-1]);
    // Cas limite isolant 2 - intérieur
    // console.log('4');
    let T_isolant2_t_int = equationDeLaChaleur(0, deltaT, deltaX, alphaIsolant2, T_isolant2[t-1][xIsolant2.length-1], T_Int[t-1], T_isolant2[t-1][xIsolant2.length-2]);
    // On met dans les variables dans l'ordre
    let T_isolant1_t = [];
    T_isolant1_t.push(T_isolant1_t_ext);
    T_isolant1_t = T_isolant1_t.concat(T_isolant1_t_x);
    T_isolant1_t.push(T_isolant1_t_isolant2);

    let T_isolant2_t = [];
    T_isolant2_t.push(T_isolant2_t_isolant1);
    T_isolant2_t = T_isolant2_t.concat(T_isolant2_t_x);
    T_isolant2_t.push(T_isolant2_t_int);

    T_isolant1.push(T_isolant1_t);
    T_isolant2.push(T_isolant2_t);

    // Calcul de la température intérieure (puissance dégagée par T_isolant2_t_int / rhoCp de l'air) -> hypothèse : ça se diffuse directement dans le volume d'air de façon homogène.
    // On prend 1m d'épaisseur d'air sec, ce qui fait qu'on n'a rien besoin de multiplier pour passer du volumique à la section.
    // Pour 1m d'air sec : rhoCp de l'air sec = coeffRhoCpAirSec / T
    // et la puissance rayonnée par l'isolant 2 vaut rhoCpIsolant2 * deltaTempératureIsolant2 / deltaT
    // la puissance absorbée par l'air sec vaut RhoCpAirSec * deltaTempératureAirSec / deltaT = (coeffRhoCpAirSec / Tair) * deltaTempératureAirSec / deltaT
    // faux : T_Int.push(Math.exp(((rhoCpIsolant2Value.value / coeffRhoCpAirSec) * (T_isolant2[t][xIsolant2.length-1] - T_isolant2[t-1][xIsolant2.length-1])) - Math.log(T_Int[t-1])));
    T_Int.push(equationDeLaChaleur(0, deltaT, 1, alphaAir, T_Int[t-1], T_Int[t-1], T_isolant2_t_int))// deltaX = 1m
    // console.log(T_Int);
  }


  // Préparation du graphique
  for (let t = 0; t < temps.length; t++){
    let date = new Date(null);
    date.setSeconds(temps[t]);
    temps.splice(t, 1, date.toISOString().slice(8, 19));
  }
  const T_isolant2_int_result = [];
  for (let t = 0; t < temps.length; t++) {
    T_isolant2_int_result.push(T_isolant2[t][xIsolant2.length-1] - 273.15); // conversion en °C
  }
  // console.log(T_isolant2_int_result);
  for (let i = 0; i < T_Int.length; i++) {
    T_Int.splice(i, 1, T_Int[i] - 273.15); // conversion en °C
  }
  for (let i = 0; i < T_Ext.length; i++) {
    T_Ext.splice(i, 1, T_Ext[i] - 273.15); // conversion en °C
  }


  // Affichage du graphique
  const ctx = document.getElementById('graphique');

  chartGraphique = new Chart(ctx, {
      type: 'line',
      data: {
      labels: temps,
      datasets: [{
        label: 'température extérieure',
        data: T_Ext,
        borderWidth: 1
      },
      {
        label: 'température intérieure',
        data: T_Int,
        borderWidth: 1
      }/*,
      {
        label: 'temp isolant 2 limite intérieur',
        data: T_isolant2_int_result,
        borderWidth: 1
      }*/]
      },
      options: {
        scales: {
          y: {
          beginAtZero: true
          }
        }
      }
  });

};
// Fin de la simulation