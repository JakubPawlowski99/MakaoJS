import * as game from './game.js';

export function renderHands() {
    // Render each player's cards
    for (let i = 0; i < game.numPlayers; i++) {
        const playerHandElement = document.getElementById(i === 0 ? 'player-hand' : `player-${i + 1}`);
        playerHandElement.innerHTML = '';
        game.players[i].hand.forEach((card, index) => {
            const cardElement = createCardElement(card);
            if (i === 0) {
                cardElement.addEventListener('click', () => {
                    if (game.playCard(0, index)) {
                        renderHands();
                    } else {
                        alert('Invalid move! Card must match the suit or rank of the center card.');
                    }
                });
            }
            playerHandElement.appendChild(cardElement);
        });
    }

    // Render center card
    const centerCardElement = document.getElementById('center-card');
    centerCardElement.innerHTML = '';
    if (game.centerCard) {
        centerCardElement.appendChild(createCardElement(game.centerCard));
    }
}

export function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    const rankElement = document.createElement('div');
    rankElement.classList.add('rank');
    rankElement.textContent = card.rank;
    const suitElement = document.createElement('img');
    suitElement.classList.add('suit');
    suitElement.src = `suits/${card.suit}.png`;
    suitElement.alt = card.suit;

    if (card.suit === 'hearts' || card.suit === 'diamonds') {
        suitElement.style.filter = 'invert(20%) sepia(96%) saturate(2701%) hue-rotate(324deg) brightness(91%) contrast(102%)';
        rankElement.style.color = 'red';
    } else {
        rankElement.style.color = 'black';
    }

    cardElement.appendChild(rankElement);
    cardElement.appendChild(suitElement);
    return cardElement;
}
