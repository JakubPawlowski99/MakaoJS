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
        console.log("Next player must draw 2 cards or counter with a 2 or 3 of the same suit.");
        // Implement logic for +2 card
    }
}

export class BlockCard extends Card {
    playEffect(game) {
        console.log("Next player is blocked unless they have a 4.");
        // Implement logic for block card
    }
}

// Add other special cards (J, Q, K, A) similarly