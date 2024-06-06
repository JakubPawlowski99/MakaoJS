// ui.js
export function renderHands(numPlayers, playerCards, opponentCards, playerHand) {    
    playerHand.innerHTML = '';
    
    // Render player's cards
    playerCards.forEach(card => {
        playerHand.appendChild(createCardElement(card));
    });

    // Render opponents' cards
    for (let i = 0; i < numPlayers - 1; i++) {
        const opponentHand = document.getElementById(`player-${i + 2}`);
        opponentHand.innerHTML = '';
        opponentCards[i].forEach(card => {
            opponentHand.appendChild(createCardElement(card));
        });
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

    // Change color for hearts and diamonds to red
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