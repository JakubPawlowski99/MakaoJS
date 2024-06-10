// player.js

import { deckCards } from './game.js'; // Import deckCards if needed

export class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.playerBlockCounter = 0; // Initialize player's block counter to 0
    }

    drawCards(numCards) {
        for (let i = 0; i < numCards; i++) {
            if (deckCards.length > 0) {
                this.hand.push(deckCards.pop());
            } else {
                console.log("Deck is empty!");
                break;
            }
        }
    }

    increasePlayerBlockCounter(value) {
        this.playerBlockCounter += value;
    }

    resetPlayerBlockCounter() {
        this.playerBlockCounter = 0;
    }

    decrementPlayerBlockCounter() {
        if (this.playerBlockCounter > 0) {
            this.playerBlockCounter--;
        }
    }

    getPlayerBlockCounter() {
        return this.playerBlockCounter;
    }
}