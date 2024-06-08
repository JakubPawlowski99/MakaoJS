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

    // Enable the "Draw Card" button and disable the "End Turn" button at the start of the round
    document.getElementById('draw-card-btn').disabled = false;
    document.getElementById('end-turn-btn').disabled = true;
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
    
        // Check if the blockCounter is greater than 0 at the start of the turn
        if (blockCounter > 0) {
            // If the player attempts to play a card other than '4' while blockCounter is > 0, prevent it
            if (card.rank !== '4') {
                alert("You must play a '4' card because previous player played 4.");
                return false;
            } else {
                // If the player plays a '4', increase the blockCounter and proceed with the turn
                increaseBlockCounter();
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
        
        // Set the flag to true indicating that a card has been played
        hasPlayedCardThisTurn = true;
        
        //disable draw button after playing card
        document.getElementById('draw-card-btn').disabled = true;
        // Enable the "End Turn" button after playing a card
        document.getElementById('end-turn-btn').disabled = false;
        
        return true;
    }
    return false;
}
export function nextTurn() {
    // Check if the blockCounter is greater than 0 at the start of the turn
    if (blockCounter > 0) {
        // Check if the current player played a '4' during their turn
        if (!hasPlayedCardThisTurn) {
            // Increase the playerBlockCounter by the value of the blockCounter
            players[currentPlayerIndex].increasePlayerBlockCounter(blockCounter);
            console.log(`Player ${players[currentPlayerIndex].name}'s Block Counter increased to ${players[currentPlayerIndex].getPlayerBlockCounter()}`);
            // Reset the blockCounter to 0
            resetBlockCounter();
            updateBlockDisplay();
            
        }

    }

    // Move to the next player's turn
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    hasPlayedCardThisTurn = false; // Reset the flag for the next player's turn
    renderHands();
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