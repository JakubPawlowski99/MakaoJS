import { deckCards } from './game.js';

export class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
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
}
