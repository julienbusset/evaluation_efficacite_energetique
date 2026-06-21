// Sliders pour les valeurs qu'on peut sélectionner
const lambdaIsolant1Value = document.querySelector("#lambdaIsolant1Value");
const lambdaIsolant1 = document.querySelector("#lambdaIsolant1");
lambdaIsolant1Value.textContent = lambdaIsolant1.value;
lambdaIsolant1.addEventListener("input", (event) => {
  lambdaIsolant1Value.textContent = event.target.value;
});

const rhoCpIsolant1Value = document.querySelector("#rhoCpIsolant1Value");
const rhoCpIsolant1 = document.querySelector("#rhoCpIsolant1");
rhoCpIsolant1Value.textContent = rhoCpIsolant1.value;
rhoCpIsolant1.addEventListener("input", (event) => {
  rhoCpIsolant1Value.textContent = event.target.value;
});

const lambdaIsolant2Value = document.querySelector("#lambdaIsolant2Value");
const lambdaIsolant2 = document.querySelector("#lambdaIsolant2");
lambdaIsolant2Value.textContent = lambdaIsolant2.value;
lambdaIsolant2.addEventListener("input", (event) => {
  lambdaIsolant2Value.textContent = event.target.value;
});

const rhoCpIsolant2Value = document.querySelector("#rhoCpIsolant2Value");
const rhoCpIsolant2 = document.querySelector("#rhoCpIsolant2");
rhoCpIsolant2Value.textContent = rhoCpIsolant2.value;
rhoCpIsolant2.addEventListener("input", (event) => {
  rhoCpIsolant2Value.textContent = event.target.value;
});

// Fonctions utiles
function interpoler (temps, premierTemps, premiereT, deuxiemeTemps, deuxiemeT) {
  let fractionARajouter = Math.abs((premierTemps - temps) / premierTemps);
  let deltaEntreLesDeuxT = Math.abs(premiereT - deuxiemeT);
  return premiereT + (deltaEntreLesDeuxT * fractionARajouter);
}

// Constantes
const P_SoleilMax = 892; // W/m²
const T_ExtMin = 20; // degrés Celsius
const T_ExtMax = 40; // degrés Celsius
const H_LeverSoleil = 6 * 3600; // 6:00
const H_CoucherSoleil = 22 * 3600; // 22:00
const SECDANSHEURE = 60 * 60;
const SECDANSJOURS = 24 * SECDANSHEURE;

// Discrétisation
const deltaT = 600; // secondes
const deltaX = 1; // mm
const dureeTotaleEnJours = 2; // jours
const dureeTotale = dureeTotaleEnJours * SECDANSJOURS; // secondes

// Construction du tableau de valeurs pour le temps
const temps = [];
for (let t = 0; t <= dureeTotale; t = t + deltaT) {
    temps.push(t);
}


// Construction du tableau de valeurs pour la puissance du soleil
const P_Soleil = [];
for (let i = 0; i < temps.length; i++) {
    P_Soleil.push(0);
}
let indexTempsDebut = Math.floor(H_LeverSoleil / deltaT);
let indexTempsFin = Math.floor(H_CoucherSoleil / deltaT);
let deltaIndexJourSuivant = Math.floor(SECDANSJOURS / deltaT);
for (let j = 1; j <= dureeTotaleEnJours; j++) {
  for (let i = indexTempsDebut; i <= indexTempsFin; i++) {
      P_Soleil.splice(i + (j - 1) * deltaIndexJourSuivant, 1, P_SoleilMax * Math.sin(Math.PI * ((H_CoucherSoleil - temps[i]) / (H_CoucherSoleil - H_LeverSoleil))));
  }
}

// Construction du tableau de valeurs pour la température (pour l'instant, juste une extraction de la journée du 26/05/2026, particulièrement chaude)
// À terme on pourra construire quelque chose avec les heures de lever et de coucher du soleil, et les températures min et max
const T_Ext_260526 = [[2,23.9],[5,21.3],[8,22.5],[11,27.8],[14,33.1],[17,34],[20,32.5],[23,26.3]]; // [heure en heure,T Celsius]
// conversion de l'heure en secondes
for (i = 0; i < T_Ext_260526.length; i++) {
  T_Ext_260526.splice(i, 1, [T_Ext_260526[i][0] * SECDANSHEURE,T_Ext_260526[i][1]]);
}
const T_Ext = [];
for (let t = 0; t <= dureeTotale; t = t + deltaT) {
  let Tinterpolee = 0;
  // Trouver la valeur du tableau la plus proche
  let indexDuTableauAvecTempsLePlusProche = 0;
  let ecartDeTemps = Math.abs(t - T_Ext_260526[0][0]);
  for (let i = 0; i < T_Ext_260526.length; i++) {
    let nouvelEcartDeTemps = Math.abs(t - T_Ext_260526[i][0]);
    if (nouvelEcartDeTemps < ecartDeTemps) {
      ecartDeTemps = nouvelEcartDeTemps;
      indexDuTableauAvecTempsLePlusProche = i;
    }
  }
  // si la valeur la plus proche est supérieure, on interpole avec la précédente
  if (T_Ext_260526[indexDuTableauAvecTempsLePlusProche][0] > t) {
    // dans ce cas, si on est sur la première valeur, on interpole avec la dernière
    if (indexDuTableauAvecTempsLePlusProche == 0) {
      Tinterpolee = interpoler(t, T_Ext_260526[T_Ext_260526.length - 1][0], T_Ext_260526[T_Ext_260526.length - 1][1], T_Ext_260526[0][0], T_Ext_260526[0][1]);
    } else {
      Tinterpolee = interpoler(t, T_Ext_260526[indexDuTableauAvecTempsLePlusProche - 1][0], T_Ext_260526[indexDuTableauAvecTempsLePlusProche - 1][1], T_Ext_260526[indexDuTableauAvecTempsLePlusProche][0], T_Ext_260526[indexDuTableauAvecTempsLePlusProche][1]);
    }
  } else {
    // sinon (valeur la plus proche est inférieure), on interpole avec la suivante
    // dans ce cas, si on est sur la dernière valeur, on interpole avec la première
    if (indexDuTableauAvecTempsLePlusProche == (T_Ext_260526.length - 1)) {
      Tinterpolee = interpoler(t, T_Ext_260526[indexDuTableauAvecTempsLePlusProche][0], T_Ext_260526[indexDuTableauAvecTempsLePlusProche][1], T_Ext_260526[T_Ext_260526.length - 1][0], T_Ext_260526[T_Ext_260526.length - 1][1]);
    } else {
      Tinterpolee = interpoler(t, T_Ext_260526[indexDuTableauAvecTempsLePlusProche][0], T_Ext_260526[indexDuTableauAvecTempsLePlusProche][1], T_Ext_260526[indexDuTableauAvecTempsLePlusProche + 1][0], T_Ext_260526[indexDuTableauAvecTempsLePlusProche + 1][1]);
    }
  }
  T_Ext.push(Tinterpolee);
}

// Affichage du graphique
const ctx = document.getElementById('graphique');

new Chart(ctx, {
    type: 'line',
    data: {
    labels: temps,
    datasets: [{
        label: 'puissance du soleil',
        data: P_Soleil,
        borderWidth: 1
    },
    {
      label: 'température extérieure',
      data: T_Ext,
      borderWidth: 1
    }]
    },
    options: {
    scales: {
        y: {
        beginAtZero: true
        }
    }
    }
});
