import { increasePenaltyCounter, increaseBlockCounter} from './game.js';
export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    isValidMove(centerCard) {
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
        increaseBlockCounter(1); // Increase the block counter by 1
    }
}