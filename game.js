import { initializeDeck } from './deck.js';
import { renderHands } from './ui.js';

export let deckCards = [];
export let centerCard = {};
export let currentPlayerIndex = 0;
export let numPlayers = 0;

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    drawCards(numCards) {
        for (let i = 0; i < numCards; i++) {
            if (deckCards.length > 0) {
                this.hand.push(deckCards.pop());
            } else {
                console.log("Deck is empty!");
                break;
            }
        }
    }
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
}

export function updateLog(message) {
    const logElement = document.getElementById('game-log');
    if (logElement) {
        logElement.innerHTML += `<p>${message}</p>`;
    }
}

export function dealCards() {
    for (const player of players) {
        player.drawCards(5);
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
    const card = players[playerIndex].hand[cardIndex];
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
        if (players[playerIndex].hand.length === 0) {
            updateLog(`${players[playerIndex].name} wins the game!`);
            endGame();
        } else {
            nextTurn();
        }
        return true;
    }
    return false;
}

export function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    renderHands();
}

export function skipTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    renderHands();
}

function endGame() {
    alert("Game Over");
}
