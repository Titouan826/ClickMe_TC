const socket = io();
const jeuxDiv = document.getElementById('jeu');
const gagneDiv = document.getElementById('gagne');
const joueursTable = document.getElementById('tableau-joueurs');
const inputChangerNom = document.getElementById('nouveau-nom');
const formChangerNom = document.getElementById('changer-nom');
const tempsDiv = document.getElementById('temps-reaction');
var debutTimer;
var finTimer;
var tempsReaction;

// Gère le click sur une cible
function clickCible(event){
    const numeroCible = event.target.getAttribute('numeroCible');
    console.log(`click sur la cible ${numeroCible}`);
    
    // Calcul et affichage du temps de réaction
    finTimer = Date.now();
    tempsReaction = finTimer - debutTimer;
    tempsReaction = tempsReaction/1000;
    //console.log(tempsReaction);

    socket.emit('click-cible', numeroCible);
}

socket.on('timer', function(){
    tempsDiv.textContent = "Temps: " + tempsReaction + " secondes.";
});

// Sockets
socket.on('initialise', function(nombreCible){
    // Vide jeuDiv
    jeuxDiv.innerHTML = '';
    // Ajoute les cibles
    for(let i = 0; i< nombreCible; i++){
        const cible = document.createElement('div');
        // Ajout de la classe .cible
        cible.classList.add('cible');
        // Ajoute l'attribut 'numeroCible' à la cible
        cible.setAttribute('numeroCible', i);

        jeuxDiv.append(cible)
        // Ecoute le click sur la cible
        cible.addEventListener('click', clickCible)
    }
});

socket.on('nouvelle-cible', function(numeroCible){
    // Enlève la classe clickme à l'ancienne cible
    const ancienneCible=document.querySelector('.clickme');
    // Attetion, à l'initialisation, ancienneCible n'existe pas!
    if ( ancienneCible ) {
        ancienneCible.classList.remove('clickme');
    }

    // Ajoute la classe clickme à la nouvelle cible
    const cible = document.querySelector(`[numeroCible="${numeroCible}"]`);

    cible.classList.add('clickme');

    // Vide gagneDiv
    gagneDiv.textContent = "";

    //Lance le timer
    debutTimer = Date.now();
});

socket.on('gagne', function(){
    gagneDiv.textContent = "C'est gagné !";
});


socket.on('maj-joueurs', function (joueurs){
    joueursTable.innerHTML = '';
    for(const joueur of joueurs){
        const ligne = joueursTable.insertRow();
        let nom = ligne.insertCell();
        nom.textContent = joueur.nom;
        if(document.getElementById('nouveau-nom').value !== ''){
            document.getElementById('nouveau-nom').value = '';
        }

        let score = ligne.insertCell();
        score.textContent = joueur.score;
        let combo = ligne.insertCell();
        if (joueur.combo >= 2){
            combo.textContent = joueur.combo;
        }
        else {
            combo.textContent = "0";
        }
        
        let comboMax = ligne.insertCell();
        if (joueur.comboMax >= 2){
            comboMax.textContent = joueur.comboMax;
        }
        else {
            comboMax.textContent = "0";
        }
    }

});

formChangerNom.addEventListener('submit', function(event){
    event.preventDefault();
    nouveauNom = inputChangerNom.value;
    socket.emit('changer-nom', nouveauNom);
});