/**
 * Classe représentant une partie de clickme.
 * ┌──────────────────┐
 * │    Partie        │
 * ├──────────────────┤
 * │ - nombreCible    │
 * │ - numeroCible    │
 * │ - joueurs        │
 * ├──────────────────┤
 * │ + nouvelleCible  │
 * │ + nouveauJoueur  │
 * │ + supprimeJoueur │
 * │ + getJoueurById  │
 * └──────────────────┘
 */

export class Partie {
    constructor(){
        this.nombreCibles = 16;
        this.numeroCible;
        this.joueurs = [];
        this.nouvelleCible();
        this.ancienGagnant;//joueur
    }

    /**
     * Choisit une nouvelle cible au hasard.
     * Modifie this.numeroCible.
     */
    nouvelleCible(){
        this.numeroCible = Math.floor(Math.random() * this.nombreCibles);
    }

    /**
    * Ajoute un joueur à la partie.
    * Le nom du joueur est 'joueur-n' ou n est le nombre de joueurs.
    * @param {string} socketId - socketId du nouveau joueur.
    */
    nouveauJoueur(socketId){
        const joueur = new Joueur(socketId, `joueur-${this.joueurs.length}`);
        this.joueurs.push(joueur);
    }

    /**
     * Supprime un joueur de la partie.
     * @param {string} socketId - socketId du joueur à supprimer
     */
    supprimeJoueur(socketId){
        this.joueurs = this.joueurs.filter(joueur => joueur.socketId != socketId);
    }

    /**
     * Retourne le joueur dont le socketId correspond à l'argument.
     * @param {string} socketId - socketId du joueur à trouver.
     * @returns {Joueur} - le joueur ayant le socketId correspondant.
     */
    getJoueurById(socketId){
        return this.joueurs.find((joueur) => joueur.socketId == socketId);
    }

    /**Un joueur a cliqué sur la bonne cible
     * 
     * @param {*} socketId 
     */
    gagne(socketId){
        this.nouvelleCible();
        // Envoie le message 'nouvelle-cible à tous les sockets.
        // Envoie le message 'gagne' seulement à ce socket.
        let joueur = this.getJoueurById(socketId);
        joueur.changerScore();
  
        if (joueur == this.ancienGagnant){
            joueur.changerCombo();
        }

        else if ((typeof this.ancienGagnant !== 'undefined')) {
              ancienGagnant.stopCombo();
        }
        this.ancienGagnant = joueur;
    }
}


/**
 * Classe représentant un joueur.
 * ┌──────────────────┐
 * │    Joueur        │
 * ├──────────────────┤
 * │ - nom            │
 * │ - socketId       |
 * | - score          |
 * | - combo          |
 * | - comboMax       |
 * ├──────────────────┤
 * └──────────────────┘
 */
class Joueur {
    constructor(socketId, nom){
        this.nom = nom;
        this.socketId = socketId;
        this.score = 0;
        this.combo = 1;
        this.comboMax = 1;
    }

    changerNom(nouveauNom){
        this.nom = nouveauNom;
    }

    changerScore(){
        this.score += 1;
    }

    changerCombo(){
        this.combo += 1;
        if (this.combo > this.comboMax){
            this.changerComboMax();
          }
    }

    stopCombo(){
        this.combo = 0;
    }

    changerComboMax(){
        this.comboMax += 1;
    }
}

