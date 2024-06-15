// card.js
import { increasePenaltyCounter, increaseBlockCounter, showCardSelectionModal, showSuitSelectionModal } from './game.js';

export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    isValidMove(centerCard, demandedCard, demandedSuit) {
        // Handle Ace card special case
        if (this.rank === 'A') {
            // Check if the card's suit matches the demanded suit (if any)
            if (demandedSuit && this.suit !== demandedSuit) {
                return false;
            }
        } else {
            // For other cards, check if the rank or suit matches the center card or demanded card/suit
            if (centerCard && this.rank !== centerCard.rank && this.suit !== centerCard.suit) {
                if (!(centerCard.rank === 'J' && this.rank === demandedCard) && this.rank !== demandedCard && this.suit !== demandedSuit) {
                    return false;
                }
            }
        }

        return true;
    }

    playEffect(game) {
        // Default effect: nothing special
    }
}

export class PlusTwoCard extends Card {
    playEffect(game) {
        game.updateLog(`${game.players[game.currentPlayerIndex].name} played a Plus Two card.`);
        increasePenaltyCounter(2);
    }
}

export class PlusThreeCard extends Card {
    playEffect(game) {
        game.updateLog(`${game.players[game.currentPlayerIndex].name} played a Plus Three card.`);
        increasePenaltyCounter(3);
    }
}

export class BlockCard extends Card {
    playEffect(game) {
        game.updateLog(`${game.players[game.currentPlayerIndex].name} played a Block card.`);
        increaseBlockCounter(); // Increase the block counter by 1
    }
}

export class JackCard extends Card {
    playEffect(game) {
        game.updateLog(`${game.players[game.currentPlayerIndex].name} played a Jack card.`);
        showCardSelectionModal();
    }

    isValidMove(centerCard, demandedCard) {
        // During demand, a Jack card can always be played
        return true;
    }
}

export class AceCard extends Card {
    playEffect(game) {
        game.updateLog(`${game.players[game.currentPlayerIndex].name} played an Ace card.`);
        game.showSuitSelectionModal();
    }

    isValidMove(centerCard, demandedCard, demandedSuit) {
        // Allow any card of the demanded suit or another Ace (`A`) card to be played
        return this.suit === demandedSuit || this.rank === 'A';
    }
}