import { initializeDeck } from './deck.js';
import { renderHands } from './ui.js';

let playerCards = [];
let opponentCards = [[], [], []]; // For up to three opponents
let deckCards = initializeDeck(); // Initialize deckCards here

export { playerCards, opponentCards, initializeDeck, renderHands }; // Export playerCards, opponentCards, initializeDeck, and renderHands
export function dealCards(numPlayers, playerHand) {
    // Clear previous hands
    playerCards = [];
    opponentCards = [[], [], []];

    // Deal initial cards to players
    for (let i = 0; i < 5; i++) {
        playerCards.push(deckCards.pop());
    }

    // Deal initial cards to opponents
    for (let j = 0; j < numPlayers - 1; j++) {
        for (let i = 0; i < 5; i++) {
            opponentCards[j].push(deckCards.pop());
        }
    }

    console.log('Player cards:', playerCards);
    console.log('Opponent cards:', opponentCards);
    renderHands(numPlayers, playerCards, opponentCards, playerHand); // Pass playerHand to renderHands
    return playerCards; // Return playerCards here
}

export function drawCard() {
    if (deckCards.length > 0) {
        return deckCards.pop();
    } else {
        console.log("Deck is empty!");
        return null;
    }
}
