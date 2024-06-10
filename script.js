import * as game from './game.js';
import { renderHands } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const playerForm = document.getElementById('player-form');
    const playerSelection = document.getElementById('player-selection');

    playerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const numPlayers = parseInt(document.getElementById('num-players').value, 10);
        if (numPlayers >= 2 && numPlayers <= 4) {
            playerSelection.style.display = 'none';
            document.getElementById('game-board').style.visibility = 'visible';
            game.initializeGame(numPlayers);
        } else {
            alert('Please enter a valid number of players (2-4).');
        }
    });

    document.getElementById('draw-card-btn').addEventListener('click', () => {
        game.drawCardHandler();
    });

    document.getElementById('end-turn-btn').addEventListener('click', () => {
        game.endTurnHandler();
    });
    document.getElementById('reshuffle-btn').addEventListener('click', () => {
        game.reshuffleHandler(); 
    });
    const deckElement = document.getElementById('deck');
    deckElement.addEventListener('mouseover', () => {
        const numCards = game.deckCards.length;
        deckElement.title = `Number of Cards in Deck: ${numCards}`;
    });
});