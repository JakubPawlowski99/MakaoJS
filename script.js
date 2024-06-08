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
        if (game.getPenaltyCounter() > 0) {
            console.log(`Starting penalty draw: penaltyCounter = ${game.getPenaltyCounter()}`);
            
            // Draw penalty cards and reset the penalty counter
            while (game.getPenaltyCounter() > 0) {
                const drawnCard = game.drawCard();
                if (drawnCard) {
                    game.players[game.currentPlayerIndex].hand.push(drawnCard);
                    game.decrementPenaltyCounter(); // Decrease the penalty counter for each card drawn
                    // Logging the decrement action
                    console.log(`Decremented penaltyCounter: ${game.getPenaltyCounter()}`);
                } else {
                    console.log("Deck is empty!");
                    break; // Stop drawing cards if the deck is empty
                }
            }
            
            // Ensuring penalty counter is reset to zero after drawing cards
            game.resetPenaltyCounter();
            console.log("Penalty draw complete, penaltyCounter reset to 0");
            
            game.updatePenaltyDisplay(); // Update penalty display
            renderHands(); // Render hands

            // Update button states
            document.getElementById('end-turn-btn').disabled = false;
            document.getElementById('draw-card-btn').disabled = true;
        } else {
            // Normal draw card logic
            const drawnCard = game.drawCard();
            if (drawnCard) {
                game.players[game.currentPlayerIndex].hand.push(drawnCard);
                game.updateLog(`${game.players[game.currentPlayerIndex].name} drew a card.`);
                renderHands();
                
                // Update button states
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