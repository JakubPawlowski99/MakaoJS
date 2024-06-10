import { initializeDeck } from './deck.js';
import { renderHands } from './ui.js';
import { Player } from './player.js';

export let deckCards = [];
export let centerCard = {};
export let currentPlayerIndex = 0;
export let numPlayers = 0;
export let penaltyCounter = 0;
export let hasPlayedCardThisTurn = false;
export let blockCounter = 0;


export function increasePenaltyCounter(value) {
    penaltyCounter += value;
    console.log(`Penalty counter increased: ${penaltyCounter}`);
}

export function resetPenaltyCounter() {
    penaltyCounter = 0;
    console.log(`Penalty counter reset to 0`);
}

export function decrementPenaltyCounter() {
    if (penaltyCounter > 0) {
        penaltyCounter--;
        console.log(`Penalty counter decremented: ${penaltyCounter}`);
    }
}

export function getPenaltyCounter() {
    return penaltyCounter;
}

export const players = [];


export function initializeGame(playersCount) {
    numPlayers = playersCount;
    deckCards = initializeDeck();
    centerCard = deckCards.pop();
    currentPlayerIndex = 0;

    players.length = 0;
    for (let i = 0; i < numPlayers; i++) {
        players.push(new Player(`Player ${i + 1}`));
    }

    dealCards();
    renderHands();

    document.getElementById('draw-card-btn').disabled = false;
    document.getElementById('end-turn-btn').disabled = true;

    // Initial button state update
    updateButtonStates();
}

export function drawCardHandler() {
    if (getPenaltyCounter() > 0) {
        console.log(`Starting penalty draw: penaltyCounter = ${getPenaltyCounter()}`);
        
        // Draw penalty cards and reset the penalty counter
        while (getPenaltyCounter() > 0) {
            const drawnCard = drawCard();
            if (drawnCard) {
                players[currentPlayerIndex].hand.push(drawnCard);
                decrementPenaltyCounter(); // Decrease the penalty counter for each card drawn
                // Logging the decrement action
                console.log(`Decremented penaltyCounter: ${getPenaltyCounter()}`);
            } else {
                console.log("Deck is empty!");
                break; // Stop drawing cards if the deck is empty
            }
        }
        
        // Ensuring penalty counter is reset to zero after drawing cards
        resetPenaltyCounter();
        console.log("Penalty draw complete, penaltyCounter reset to 0");
        
        updatePenaltyDisplay(); // Update penalty display
        renderHands(); // Render hands

        // Update button states
        document.getElementById('end-turn-btn').disabled = false;
        document.getElementById('draw-card-btn').disabled = true;
    } else {
        // Normal draw card logic
        const drawnCard = drawCard();
        if (drawnCard) {
            players[currentPlayerIndex].hand.push(drawnCard);
            updateLog(`${players[currentPlayerIndex].name} drew a card.`);
            renderHands();
            
            // Update button states
            document.getElementById('end-turn-btn').disabled = false;
            document.getElementById('draw-card-btn').disabled = true;
        }
    }
}

export function endTurnHandler() {
    nextTurn(); // End the current player's turn
    // Disable the "End Turn" button and enable the "Draw Card" button
    updateButtonStates();
}


export function increaseBlockCounter() {
    blockCounter++;
    console.log(`Block counter increased: ${blockCounter}`);
}

export function resetBlockCounter() {
    blockCounter = 0;
    console.log(`Block counter reset to 0`);
}

export function getBlockCounter() {
    return blockCounter;
}

export function updateLog(message) {
    const logElement = document.getElementById('game-log');
    if (logElement) {
        logElement.innerHTML += `<p>${message}</p>`;
    }
}

export function dealCards() {
    for (const player of players) {
        player.drawCards(10);
    }
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
    if (playerIndex !== currentPlayerIndex) {
        alert("It's not your turn!");
        return false;
    }

    if (hasPlayedCardThisTurn) {
        alert("You can only play one card per turn!");
        return false;
    }

    const card = players[playerIndex].hand[cardIndex];
    
    if (blockCounter > 0) {
        // If the player attempts to play a card other than '4' while blockCounter is > 0, prevent it
        if (card.rank !== '4') {
            alert("You must play a '4' card because the previous player played a '4'.");
            return false;
        } else {
            hasPlayedCardThisTurn = true;
        }
    }

    if (card.isValidMove(centerCard)) {
        centerCard = card;
        players[playerIndex].hand.splice(cardIndex, 1);
        card.playEffect({
            currentPlayerIndex,
            numPlayers,
            players,
            updateLog,
            skipTurn
        });
        updatePenaltyDisplay();
        updateBlockDisplay();

        if (players[playerIndex].hand.length === 0) {
            updateLog(`${players[playerIndex].name} wins the game!`);
            endGame();
        }

        hasPlayedCardThisTurn = true;
        
        document.getElementById('draw-card-btn').disabled = true;
        document.getElementById('end-turn-btn').disabled = false;
        
        return true;
    }
    return false;
}
export function nextTurn() {
    if (blockCounter > 0) {
        // Check if the current player played a '4' during their turn
        if (!hasPlayedCardThisTurn) {
            // Increase the playerBlockCounter by the value of the blockCounter
            players[currentPlayerIndex].increasePlayerBlockCounter(blockCounter);
            console.log(`Player ${players[currentPlayerIndex].name}'s Block Counter increased to ${players[currentPlayerIndex].getPlayerBlockCounter()}`);
            // Reset and update the blockCounter
            resetBlockCounter();
            updateBlockDisplay();
        }
    }

    // Move to the next player's turn
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    hasPlayedCardThisTurn = false; // Reset the flag for the next player's turn
    renderHands();
    updateButtonStates(); // Update button states at the start of the turn
}

export function updateButtonStates() {
    const drawCardBtn = document.getElementById('draw-card-btn');
    const endTurnBtn = document.getElementById('end-turn-btn');

    if (blockCounter > 0) {
        endTurnBtn.disabled = false;
    } else {
        drawCardBtn.disabled = false;
        endTurnBtn.disabled = !hasPlayedCardThisTurn;
    }
}

export function skipTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    renderHands();
}
export function updatePenaltyDisplay() {
    const penaltyDisplay = document.getElementById('penalty-display');
    if (penaltyDisplay) {
        penaltyDisplay.textContent = `Penalty: ${penaltyCounter}`;
    }
}

export function updateBlockDisplay() {
    const blockDisplay = document.getElementById('block-display');
    if (blockDisplay) {
        blockDisplay.textContent = `Block: ${blockCounter}`;
    }
}


function endGame() {
    alert("Game Over");
}