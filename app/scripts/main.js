/*jshint esversion: 6 */

const gameBoard = document.querySelector('.game-board');
const movesCounterElement = document.querySelector('.moves__counter');
const resetButton = document.querySelector('.reset-game-button');
const cardSymbols = ['bomb', 'bolt', 'heart', 'database', 'flask', 'gem', 'poo', 'gamepad', 'bomb', 'bolt', 'heart', 'database', 'flask', 'gem', 'poo', 'gamepad'];
const logo = document.querySelector('.logo');
const timeCounterContainerElement = document.querySelector('.time__counter');
const starRatingContainerElement = document.querySelector('.stars');
const starRatingElements = document.getElementsByClassName('star');
const endScreenElement = document.querySelector('.end-screen');
let gameTimer;
let starCount = 3;
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

	for (let i = 0; i < amount; i++) {
		// Create card element & card wrapper element
		const newCardWrapper = document.createElement('div');
		const newCard = document.createElement('div');
		newCardWrapper.setAttribute('class', 'card-wrapper');
		newCardWrapper.addEventListener('mousemove', addCardHoverEffect);
		newCardWrapper.addEventListener('mouseout', removeCardHoverEffect);
		newCardWrapper.appendChild(newCard);
		newCard.setAttribute('class', 'card');
		newCard.setAttribute('data-symbol', cardSymbols[i]);

		// Create card frontside
		const cardFront = document.createElement('figure');
		cardFront.setAttribute('class', 'card__front');
		newCard.appendChild(cardFront);

		// Create card backside
		const cardBack = document.createElement('figure');
		cardBack.setAttribute('class', 'card__back');
		cardBack.innerHTML = `<i class="card__symbol fas fa-${cardSymbols[i]}"></i>`;
		newCard.appendChild(cardBack);

		newCard.addEventListener('click', flipCard);
		fragment.appendChild(newCardWrapper);
	}

	gameBoard.appendChild(fragment);
}

// Add card to active cards array on selection, if two cards are selected, check if they are a match
function flipCard() {
	if (firstMove) {
		gameTimer = setInterval(setTime, 1000);
		firstMove = false;
		resetButton.classList.add('active');
	}

	if (activeCards.length < 2) {
		activeCards.push(this);
		animateCardFlip(this);
		this.removeEventListener('click', flipCard);
	}

	if (activeCards.length === 2) {
		gameBoard.classList.add('game-board--disabled');
		checkCardMatch();
	}
}

// Check for card match by comparing the symbol data-attribute
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

	setTimeout(function() {
		gameBoard.classList.remove('game-board--disabled');
	}, 1000);
}

// If no match was found, clear active cards array, remove flipped state styles and add the flip card event listener back
function clearActiveCards() {
	if (activeCards.length > 1) {
		for (let card of activeCards) {
			card.classList.remove('card--flipped');
			card.classList.remove('card--flipped-left');
			card.classList.remove('card--flipped-right');
			card.addEventListener('click', flipCard);
		}
		activeCards = [];
	}
}

// Update the moves count and update star rating based on current moves count
function updateMovesCounter() {
	movesCounter += 1;
	movesCounterElement.textContent = movesCounter;
	updateStarRating(movesCounter);
}

// Stop the timer, start the victory animation and show congratulations popup
function endGame() {
	clearInterval(gameTimer);
	showEndScreen();

	setInterval(function() {
		for (let i = 0; i < 3; i++) {
			setTimeout(victoryAnimation, 1000);
		}
	}, 500);
}

// Update star rating based on moves count
function updateStarRating(moves) {
	switch (moves) {
		case 10:
			starRatingElements[2].classList.add('star--disabled');
			starCount = 2;
		break;
		case 15:
			starRatingElements[1].classList.add('star--disabled');
			starCount = 1;
		break;
	}
}

// Update & make congratulations popup visible
// Stars & timer are copied from in-game display, the message is set based on current star rating
function showEndScreen() {
	const endScreenMessage = endScreenElement.querySelector('.end-screen__message');
	const endScreenStars = endScreenElement.querySelector('.end-screen__stars');
	const endScreenTimer = endScreenElement.querySelector('.end-screen__timer');

	switch (starCount) {
		case 3:
			endScreenMessage.textContent = 'Awesome job, you did great!';
		break;
		case 2:
			endScreenMessage.textContent = 'Good work, keep training!';
		break;
		case 1:
			endScreenMessage.textContent = 'Nice, but you can do better!';
		break;
	}

	if (totalSeconds < 10) {
		endScreenMessage.textContent = 'Wait a minute, did you cheat?';
	}

	endScreenStars.innerHTML = starRatingContainerElement.innerHTML;
	endScreenTimer.innerHTML = timeCounterContainerElement.innerHTML;

	gameBoard.classList.add('game-board--blurred');
	endScreenElement.classList.add('end-screen--active');
}

// Add CSS to flip card over, cards turning direction is based on which side of the card user is hovering over
function animateCardFlip(card) {
	if (card.classList.contains('card--hovering-left')) {
		card.classList.add('card--flipped');
		card.classList.add('card--flipped-left');
	} else {
		card.classList.add('card--flipped');
		card.classList.add('card--flipped-right');
	}
}

// Add CSS hover effect based on which side of the card user is hovering over
function addCardHoverEffect(event) {
	let elementWidth = (this.offsetWidth);
	let firstHalf = elementWidth / 2;

	if ((event.pageX - this.offsetLeft) < firstHalf) {
		this.firstElementChild.classList.add('card--hovering-left');
		this.firstElementChild.classList.remove('card--hovering-right');
	} else {
		this.firstElementChild.classList.add('card--hovering-right');
		this.firstElementChild.classList.remove('card--hovering-left');
	}
}

// Remove CSS hover effects from card
function removeCardHoverEffect(event) {
	this.firstElementChild.classList.remove('card--hovering-left');
	this.firstElementChild.classList.remove('card--hovering-right');
}

// Split logo texts letters to separate elements
// For displaying correct matches count & victory animation
function initializeLogo() {
	const logoText = logo.textContent;
	let splitLogo = '';

	for (let i = 0; i < logoText.length; i++) {
		splitLogo += `<span data-letter="${i + 1}">${logoText.charAt(i)}</span>`;
	}

	logo.innerHTML = splitLogo;
}

// Highlight a logo letter when a correct match is made
function updateLogo() {
	let letterToUpdate = document.querySelector(`[data-letter="${correctMatches}"]`);
	letterToUpdate.classList.add('active');
}

// Victory animation loops through all logo letters toggling a class on/off
function victoryAnimation() {
	for (let i = 0; i < 8; i++) {
		flashLetters(i);
	}
}

function flashLetters(i) {
	setTimeout(function() {
		let letter = document.querySelector(`[data-letter="${i + 1}"]`);
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
	let valString = val + '';
	if (valString.length < 2) {
		return '0' + valString;
	} else {
		return valString;
	}
}

function resetGame() {
	window.location.reload(false);
}

initializeLogo();
shuffle(cardSymbols);
createCards();
