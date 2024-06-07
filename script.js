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
        // Check if there's a penalty
        if (game.penaltyCounter > 0) {
            // Draw penalty cards and reset the penalty counter
            while (game.penaltyCounter > 0) {
                const drawnCard = game.drawCard();
                if (drawnCard) {
                    game.players[game.currentPlayerIndex].hand.push(drawnCard);
                    game.penaltyCounter--; // Decrease the penalty counter for each card drawn
                } else {
                    break; // Stop drawing cards if the deck is empty
                }
            }
            game.penaltyCounter = 0; // Reset penalty counter
            game.updatePenaltyDisplay(); // Update penalty display
            renderHands(); // Render hands

            document.getElementById('end-turn-btn').disabled = false;
            document.getElementById('draw-card-btn').disabled = true;
        } else {
            // Normal draw card logic
            const drawnCard = game.drawCard();
            if (drawnCard) {
                game.players[game.currentPlayerIndex].hand.push(drawnCard);
                game.updateLog(`${game.players[game.currentPlayerIndex].name} drew a card.`);
                renderHands();
                document.getElementById('end-turn-btn').disabled = false;
                document.getElementById('draw-card-btn').disabled = true;
            }
        }
    });
    

    document.getElementById('end-turn-btn').addEventListener('click', () => {
        game.nextTurn(); // End the current player's turn
        // Disable the "End Turn" button and enable the "Draw Card" button
        document.getElementById('end-turn-btn').disabled = true;
        document.getElementById('draw-card-btn').disabled = false;
    });
});
