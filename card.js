import { increasePenaltyCounter, increaseBlockCounter, showCardSelectionModal} from './game.js';
export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    isValidMove(centerCard, demandedCard) {
        if (demandedCard !== '-' && this.rank !== demandedCard) {
            return false;
        }
        
        // Check for special cases like Jack
        if (centerCard.rank === 'J') {
            return this.rank === demandedCard || this.rank === 'J';
        }
        
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