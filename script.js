import * as game from './game.js'; // Import everything from game.js
import { initializeDeck } from './deck.js';
import { renderHands } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const playerHand = document.getElementById('player-hand'); // Define playerHand here
    const playerForm = document.getElementById('player-form');
    const playerSelection = document.getElementById('player-selection');

    let numPlayers = 0;
    let deckCards = [];
    let playerCards = []; // Define playerCards here

    playerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        numPlayers = parseInt(document.getElementById('num-players').value, 10);
        if (numPlayers >= 2 && numPlayers <= 4) {
            playerSelection.style.display = 'none';
            document.getElementById('game-board').style.visibility = 'visible';
            deckCards = game.initializeDeck(); // Access initializeDeck through the game namespace
            playerCards = game.dealCards(numPlayers, playerHand); // Access dealCards through the game namespace
        } else {
            alert('Please enter a valid number of players (2-4).');
        }
    });

    document.getElementById('draw-card-btn').addEventListener('click', () => {
        const drawnCard = game.drawCard();
        if (drawnCard) {
            // Add drawn card to the player's hand (assuming it's the player's turn)
            playerCards.push(drawnCard);
            // Update the UI to reflect the new card in the player's hand
            renderHands(numPlayers, playerCards, game.opponentCards, playerHand, game.centerCard);
        }
    });
});
