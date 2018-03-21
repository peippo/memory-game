/*jshint esversion: 6 */

const gameBoard = document.querySelector('.game-board');
const movesCounterElement = document.querySelector('.moves__counter');
const resetButton = document.querySelector('.reset-game');
const cardSymbols = ['bomb', 'bolt', 'heart', 'database', 'flask', 'gem', 'poo', 'gamepad', 'bomb', 'bolt', 'heart', 'database', 'flask', 'gem', 'poo', 'gamepad'];
const logo = document.querySelector('.logo');
let gameTimer;
let activeCards = [];
let movesCounter = 0;
let correctMatches = 0;
let firstMove = true;

resetButton.addEventListener('click', resetGame);

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
	if (firstMove) {
		gameTimer = setInterval(setTime, 1000);
		firstMove = false;
	}

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
			correctMatches += 1;
			updateLogo();
			activeCards = [];

			if (correctMatches === 8) {
				endGame();
			}

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

function endGame() {
	clearInterval(gameTimer);

	setInterval(function() {
		for (var i = 0; i < 3; i++) {
			setTimeout(victoryAnimation, 1000);
		}
	}, 500);
}

function initializeLogo() {
	const logoText = logo.textContent;
	let splitLogo = '';

	for (let i = 0; i < logoText.length; i++) {
		splitLogo += '<span data-letter="' + (i + 1) + '">' + logoText.charAt(i) + '</span>';
	}

	logo.innerHTML = splitLogo;
}

function updateLogo() {
	let letterToUpdate = document.querySelector('[data-letter="' + correctMatches + '"]');
	letterToUpdate.classList.add('active');
}

function victoryAnimation() {
	for (var i = 0; i < 8; i++) {
		flashLetters(i);
	}
}

function flashLetters(i) {
	setTimeout(function() {
		let letter = document.querySelector('[data-letter="' + (i + 1) + '"]');
		letter.classList.toggle('active');
	}, i * 300);
}


// Timer from stackoverflow, https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
const minutesLabel = document.getElementById('minutes');
const secondsLabel = document.getElementById('seconds');
let totalSeconds = 0;

function setTime() {
	++totalSeconds;
	secondsLabel.innerHTML = pad(totalSeconds % 60);
	minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
	var valString = val + '';
	if (valString.length < 2) {
		return '0' + valString;
	} else {
		return valString;
	}
}

function resetGame() {
	clearInterval(gameTimer);
	totalSeconds = 0;
	minutesLabel.textContent = '00';
	secondsLabel.textContent = '00';
	correctMatches = 0;
	initializeLogo();
	movesCounter = 0;
	movesCounterElement.textContent = movesCounter;
	firstMove = true;
	activeCards = [];
	gameBoard.innerHTML = '';
	shuffle(cardSymbols);
	createCards();
}

initializeLogo();
shuffle(cardSymbols);
createCards();
