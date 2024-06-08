import { Card, PlusTwoCard, PlusThreeCard, BlockCard  } from './card.js';
//include , BlockCard  in import later when implemented
export function initializeDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            if (rank === '2') {
                deck.push(new PlusTwoCard(suit, rank));
            }else if (rank === '3') {
                deck.push(new PlusThreeCard(suit, rank));
            } else if (rank === '4') {
                deck.push(new BlockCard(suit, rank));
            } else {
                deck.push(new Card(suit, rank));
            }
        }
    }
    return shuffle(deck);
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}