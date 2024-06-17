// game.js
import { initializeDeck, shuffle } from './deck.js';
import { renderHands } from './ui.js';
import { Player } from './player.js';

export let deckCards = [];
export let centerCard = {};
export let playedCards = [];
export let currentPlayerIndex = 0;
export let numPlayers = 0;
export let penaltyCounter = 0;
export let hasPlayedCardThisTurn = false;
export let blockCounter = 0;
export let demandedCard = '-';
export let demandedSuit = null;
export let initialJackPlayerIndex = -1;
export let demandMetByInitialPlayer = false;


export const players = [];

// Functions to export
export function initializeGame(playersCount) {
    numPlayers = playersCount;
    deckCards = initializeDeck();
    centerCard = deckCards.pop();
    playedCards.push(centerCard);
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
    const currentPlayer = players[currentPlayerIndex];
    console.log(`${currentPlayer.name}'s Block Counter: ${currentPlayer.getPlayerBlockCounter()}`);
    // Decrease player's block counter by 1 if greater than 0
    if (players[currentPlayerIndex].getPlayerBlockCounter() > 0) {
        players[currentPlayerIndex].decrementPlayerBlockCounter();
        updateBlockDisplay(); // Update block counter display
    }
    // Disable the "End Turn" button and enable the "Draw Card" button
    updateButtonStates();
}

export function showSuitSelectionModal() {
    const modal = document.getElementById('suit-selection-modal');
    modal.style.display = 'flex';
}


export function selectSuit(suit) {
    demandedSuit = suit;
    document.getElementById('suit-selection-modal').style.display = 'none';
    document.getElementById('demand-display').textContent = `Demand: ${suit}`;

    document.getElementById('end-turn-btn').disabled = false;
    document.getElementById('draw-card-btn').disabled = true;
}

// Expose selectSuit function to the global scope
window.selectSuit = selectSuit;

export function enforceDemand(card) {
    if (demandedSuit && card.suit !== demandedSuit) {
        alert(`You must play a card of the demanded suit: ${demandedSuit}.`);
        return false;
    }

    if (demandedCard !== '-') {
        if (!(centerCard.rank === 'J' && card.rank === demandedCard) && card.rank !== demandedCard) {
            alert(`You must play a '${demandedCard}' card or draw a card.`);
            return false;
        }
    }

    return true;
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

export function showCardSelectionModal() {
    const modal = document.getElementById('card-selection-modal');
    const options = document.getElementById('card-selection-options');
    options.innerHTML = '';

    const validRanks = ['5', '6', '7', '8', '9', '10'];
    for (let rank of validRanks) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = rank; // Show only the rank, without suit
        cardElement.addEventListener('click', () => selectCard(rank));
        options.appendChild(cardElement);
    }

    modal.style.display = 'flex';
}

export function selectCard(rank) {
    demandedCard = rank;
    document.getElementById('demand-display').textContent = `Demand: ${rank}`;
    document.getElementById('card-selection-modal').style.display = 'none';
}

export function resetDemand() {
    demandedCard = '-';
    document.getElementById('demand-display').textContent = 'Demand: -';
}

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

export function updateLog(message) {
    const logElement = document.getElementById('game-log');
    if (logElement) {
        logElement.innerHTML += `<p>${message}</p>`;
    }
}

export function dealCards() {
    for (const player of players) {
        player.drawCards(15);
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
        if (card.rank !== '4') {
            alert("You must play a '4' card because the previous player played a '4'.");
            return false;
        } else {
            hasPlayedCardThisTurn = true;
        }
    }

    // Check enforcement of demand
    if (!enforceDemand(card)) {
        return false;
    }

    // Check if the move is valid based on the current center card and demanded card/suit
    if (card.isValidMove(centerCard, demandedCard, demandedSuit)) {
        centerCard = card; // Update center card
        players[playerIndex].hand.splice(cardIndex, 1); // Remove the played card from the player's hand
        renderHands(); // Render hands after playing a card

        // Handle special cards and demands
        if (card.rank === '2') {
            increasePenaltyCounter(2);
            updatePenaltyDisplay(); // Update penalty display
        } else if (card.rank === '3') {
            increasePenaltyCounter(3);
            updatePenaltyDisplay(); // Update penalty display
        } else if (card.rank === 'J') {
            initialJackPlayerIndex = playerIndex;
            showCardSelectionModal();
        } else if (card.rank === 'A') {
            showSuitSelectionModal();
            resetDemand(); // Reset the demand after playing an Ace
            hasPlayedCardThisTurn = true; // Set hasPlayedCardThisTurn to true after playing Ace and selecting suit
            return true; // Allow the player to end their turn after selecting suit
        } else if (card.rank === '4') {
            increaseBlockCounter();
        }

        hasPlayedCardThisTurn = true; // Set hasPlayedCardThisTurn to true after playing a valid card

        // End the game if the current player has no more cards
        if (players[currentPlayerIndex].hand.length === 0) {
            endGame();
        }

        // Update button states
        updateButtonStates();

        // After a player successfully plays a card, check if the initial player met the demand
        if (demandMetByInitialPlayer && currentPlayerIndex === initialJackPlayerIndex) {
            resetDemand();
            demandMetByInitialPlayer = false; // Reset demand met flag
        }

        return true;
    } else {
        alert(`Invalid move! You cannot play this card.`);
        return false;
    }
}
export function nextTurn() {
    if (blockCounter > 0) {
        if (!hasPlayedCardThisTurn) {
            players[currentPlayerIndex].increasePlayerBlockCounter(blockCounter);
            resetBlockCounter();
            updateBlockDisplay();
        }
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;

    // Reset demand after the initial player has met the demand
    if (initialJackPlayerIndex !== -1 && currentPlayerIndex === initialJackPlayerIndex && demandMetByInitialPlayer) {
        resetDemand();
        initialJackPlayerIndex = -1; // Reset initialJackPlayerIndex
        demandMetByInitialPlayer = false; // Reset demand met flag
    }

    hasPlayedCardThisTurn = false;
    renderHands();
    updateButtonStates();
}

export function updateButtonStates() {
    const drawCardBtn = document.getElementById('draw-card-btn');
    const endTurnBtn = document.getElementById('end-turn-btn');
    const currentPlayer = players[currentPlayerIndex];

    if (currentPlayer.getPlayerBlockCounter() > 0 || getBlockCounter() > 0) {
        // Player is blocked or there's a global block, disable draw card button and enable end turn button
        drawCardBtn.disabled = true;
        endTurnBtn.disabled = false;
        document.getElementById('player-hand').classList.add('blocked');
    } else {
        drawCardBtn.disabled = false;
        endTurnBtn.disabled = !hasPlayedCardThisTurn;
        document.getElementById('player-hand').classList.remove('blocked');
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

export function reshuffleHandler() {
    // Join played cards excluding the last one to the deck
    if (playedCards.length > 1) { // Check if there are played cards to reshuffle
        // Exclude the last played card
        const cardsToReshuffle = playedCards.slice(0, playedCards.length - 1);
        // Concatenate the played cards to the deck
        deckCards = deckCards.concat(cardsToReshuffle);
        shuffle(deckCards);
        // Clear the played cards array
        playedCards = [];
        console.log("Deck reshuffled.");
        // Render hands after reshuffling
        renderHands();
    } else {
        console.log("There are not enough played cards to reshuffle.");
    }
}

function endGame() {
    alert("Game Over");
}

