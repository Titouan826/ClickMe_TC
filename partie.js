/**
 * Classe représentant une partie de clickme.
 * ┌──────────────────┐
 * │    Partie        │
 * ├──────────────────┤
 * │ - nombreCible    │
 * │ - numeroCible    │
 * │ - joueurs        |
 * │ - ancienGagnant  │
 * ├──────────────────┤
 * │ + nouvelleCible  │
 * │ + nouveauJoueur  │
 * │ + supprimeJoueur │
 * │ + getJoueurById  │
 * │ + gagne          │
 * └──────────────────┘
 */

export class Partie {
    constructor(){
        this.nombreCibles = 16;
        this.numeroCible;
        this.joueurs = [];
        this.nouvelleCible();
        this.ancienGagnant; // Un joueur
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
     * Met à jour le score et les combos
     * @param {*} socketId - socketId du gagnant
     */
    gagne(socketId){
        this.nouvelleCible();
        let joueur = this.getJoueurById(socketId);
        joueur.changerScore();
  
        // Incremente le combo si le joueur a deja gagne le tour precedent
        if (joueur == this.ancienGagnant){
            joueur.changerCombo();
        }

        // C'est un nouveau gagnant: on arrete le combo du gagnant precedent
        else if (typeof this.ancienGagnant !== 'undefined') {
            this.ancienGagnant.stopCombo();
        }

        // On stocke le gagnant pour le prochain tour
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
 * | + changerNom     |
 * | + changerScore   |
 * | + changerCombo   |
 * | + stopCombo      |
 * | + changerComboMax|
 * └──────────────────┘
 */
class Joueur {
    constructor(socketId, nom){
        this.nom = nom;
        this.socketId = socketId;
        this.score = 0;
        // On initialise le combo a 1 car un combo commence a 2
        this.combo = 1;
        this.comboMax = 1;
    }

    
    /**
     * Change le nom d'un joueur 
     * @param {string} nouveauNom - nom du joueur à changer
     */
    changerNom(nouveauNom){
        this.nom = nouveauNom;
    }

    /**
     * Change le score d'un joueur
     */
    changerScore(){
        this.score += 1;
    }

    /**
     * Change le combo d'un joueur
     */
    changerCombo(){
        this.combo += 1;
        if (this.combo > this.comboMax){
            this.changerComboMax();
          }
    }

    /**
     * Stoppe le combo d'un joueur et le remet à 1
     */
    stopCombo(){
        // On remet le combo a 1 pour qu'il s'incremente au bon moment
        // Si on le met a 0, il se met à jour 1 tour trop tard
        this.combo = 1;
    }

    /**
     * Change le comboMax d'un joueur
     */
    changerComboMax(){
        this.comboMax += 1;
    }
}

