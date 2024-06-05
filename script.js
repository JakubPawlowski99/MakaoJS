document.addEventListener('DOMContentLoaded', () => {
    const playerHand = document.getElementById('player-hand');
    const player2Hand = document.getElementById('player-2');
    const player3Hand = document.getElementById('player-3');
    const player4Hand = document.getElementById('player-4');
    const deck = document.getElementById('deck');
    const discardPile = document.getElementById('discard-pile');
    const playerSelection = document.getElementById('player-selection');
    const playerForm = document.getElementById('player-form');

    let numPlayers = 0;
    let deckCards = [];
    let playerCards = [];
    let opponentCards = [[], [], []]; // For up to three opponents
    let discardPileCards = [];

    function initializeDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ suit, rank });
            }
        }
        return shuffle(deck);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function dealCards() {
        // Clear previous hands
        playerCards = [];
        opponentCards = [[], [], []];
    
        // Deal initial cards to players
        for (let i = 0; i < 5; i++) {
            playerCards.push(deckCards.pop());
        }
    
        // Deal initial cards to opponents
        for (let j = 0; j < numPlayers - 1; j++) {
            for (let i = 0; i < 5; i++) {
                opponentCards[j].push(deckCards.pop());
            }
        }
    
        console.log('Player cards:', playerCards);
        console.log('Opponent cards:', opponentCards);
        renderHands();
    }
    
    function renderHands() {
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

    function createCardElement(card) {
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

    playerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        numPlayers = parseInt(document.getElementById('num-players').value, 10);
        if (numPlayers >= 2 && numPlayers <= 4) {
            playerSelection.style.display = 'none';
            document.getElementById('game-board').style.visibility = 'visible';
            deckCards = initializeDeck();
            dealCards();
        } else {
            alert('Please enter a valid number of players (2-4).');
        }
    });
});
