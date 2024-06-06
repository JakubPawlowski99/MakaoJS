// script.js
import { dealCards } from './game.js';
import { initializeDeck } from './deck.js';

document.addEventListener('DOMContentLoaded', () => {
    const playerHand = document.getElementById('player-hand'); // Define playerHand here
    const playerForm = document.getElementById('player-form');
    const playerSelection = document.getElementById('player-selection');

    let numPlayers = 0;
    let deckCards = [];

    playerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        numPlayers = parseInt(document.getElementById('num-players').value, 10);
        if (numPlayers >= 2 && numPlayers <= 4) {
            playerSelection.style.display = 'none';
            document.getElementById('game-board').style.visibility = 'visible';
            deckCards = initializeDeck();
            dealCards(numPlayers, playerHand); // Pass playerHand to dealCards
        } else {
            alert('Please enter a valid number of players (2-4).');
        }
    });
});