// card.js
import { increasePenaltyCounter, increaseBlockCounter, showCardSelectionModal, showSuitSelectionModal } from './game.js';

export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    isValidMove(centerCard, demandedCard, demandedSuit) {
        // Handle special case for Ace card
        if (this.rank === 'A') {
            if (demandedSuit && this.suit !== demandedSuit) {
                return false;
            }
            return true;
        }

        // Handle special case for Queen card
        if (this.rank === 'Q') {
            // Can be played on any non-special card (non-block, non-draw) regardless of suit/rank
            if (['2', '3', '4', 'J'].includes(centerCard.rank)) {
                return false;
            }
            return true;
        }

        // Check for demanded suit or card
        if (demandedSuit && this.suit !== demandedSuit) {
            return false;
        }
        if (demandedCard !== '-' && this.rank !== demandedCard) {
            return false;
        }

        // Normal card matching rules
        return this.suit === centerCard.suit || this.rank === centerCard.rank;
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