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
        const drawnCard = game.drawCard();
        if (drawnCard) {
            game.players[0].hand.push(drawnCard);
            renderHands();
        }
    });
});
