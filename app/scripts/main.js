/*jshint esversion: 6 */

const gameBoard = document.querySelector('.game-board');
const movesCounterElement = document.querySelector('.moves__counter');
const cardSymbols = ['bomb', 'bolt', 'heart', 'database', 'flask', 'gem', 'poo', 'gamepad', 'bomb', 'bolt', 'heart', 'database', 'flask', 'gem', 'poo', 'gamepad'];
let activeCards = [];
let movesCounter = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function createCards(amount = 16) {
	const fragment = document.createDocumentFragment();

	for (var i = 0; i < amount; i++) {
		// Create card element & card wrapper element
		const newCardWrapper = document.createElement('div');
		const newCard = document.createElement('div');
		newCardWrapper.setAttribute('class', 'card-wrapper');
		newCardWrapper.appendChild(newCard);
		newCard.setAttribute('class', 'card');
		newCard.setAttribute('data-symbol', cardSymbols[i]);

		// Create card frontside
		const cardFront = document.createElement('figure');
		cardFront.setAttribute('class', 'card__front');

		// Debug info
		//cardFront.innerHTML = cardSymbols[i];

		newCard.appendChild(cardFront);

		// Create card backside
		const cardBack = document.createElement('figure');
		cardBack.setAttribute('class', 'card__back');
		cardBack.innerHTML = '<i class="fas fa-4x fa-' + cardSymbols[i] + '"></i>';
		newCard.appendChild(cardBack);

		newCard.addEventListener('click', flipCard);
		fragment.appendChild(newCardWrapper);
	}

	gameBoard.appendChild(fragment);
}

function flipCard() {
	if (activeCards.length < 2) {
		activeCards.push(this);
		this.classList.add('card--flipped');
		this.removeEventListener('click', flipCard);
	}
	if (activeCards.length === 2) {
		checkCardMatch();
	}
}

function checkCardMatch() {
	if (activeCards[0].getAttribute('data-symbol') === activeCards[1].getAttribute('data-symbol')) {
			for (let card of activeCards) {
				card.classList.add('card--matched');
			}
			activeCards = [];
		} else {
			setTimeout(clearActiveCards, 1000);
	}

	updateMovesCounter();
}

function clearActiveCards() {
	if (activeCards.length > 1) {
		for (let card of activeCards) {
			card.classList.remove('card--flipped');
			card.addEventListener('click', flipCard);
		}
		activeCards = [];
	}
}

function updateMovesCounter() {
	movesCounter += 1;
	movesCounterElement.textContent = movesCounter;
}

shuffle(cardSymbols);
createCards();
