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
        const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.numPlayers;
        game.players[nextPlayerIndex].drawCards(2);
        game.updateLog(`${game.players[nextPlayerIndex].name} must draw 2 cards.`);
        game.skipTurn();
    }
}

export class BlockCard extends Card {
    playEffect(game) {
        game.updateLog(`${game.players[(game.currentPlayerIndex + 1) % game.numPlayers].name} is blocked.`);
        game.skipTurn();
    }
}
