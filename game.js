import { initializeDeck } from './deck.js';
import { renderHands } from './ui.js';

let playerCards = [];
let opponentCards = [[], [], []]; // For up to three opponents
let deckCards = initializeDeck(); // Initialize deckCards here
let centerCard = {}; // Initialize centerCard

export { playerCards, opponentCards, initializeDeck, renderHands, centerCard }; // Export centerCard

export function dealCards(numPlayers, playerHand) {
    // Clear previous hands
    playerCards = [];
    opponentCards = [[], [], []];

    // Deal one card to the center area
    centerCard = deckCards.pop();

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
    console.log('Center card:', centerCard); // Log centerCard

    renderHands(numPlayers, playerCards, opponentCards, playerHand, centerCard); // Pass centerCard to renderHands
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

export function playCard(playerIndex, cardIndex) {
    const card = playerCards[cardIndex];
    if (card.isValidMove(centerCard)) {
        centerCard = card;
        playerCards.splice(cardIndex, 1);
        card.playEffect({ /* game state here */ });
        return true;
    }
    return false;
}