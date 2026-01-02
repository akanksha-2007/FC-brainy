// Default flashcards
let cards = [
  { question: "What is the capital of India?", answer: "New Delhi" },
  { question: "What does HTML stand for?", answer: "HyperText Markup Language" },
  { question: "22*22 = ?", answer: "484" },
  { question: "CSS is used for?", answer: "Styling web pages" }
];

let currentIndex = 0;
const flashcard = document.getElementById("flashcard");
const cardFront = document.getElementById("card-front");
const cardBack = document.getElementById("card-back");
const progress = document.getElementById("progress");

// Show current card
function showCard() {
  if (cards.length === 0) {
    cardFront.textContent = "No cards!";
    cardBack.textContent = "";
    progress.textContent = "Card 0 of 0";
    flashcard.classList.remove("flipped");
    return;
  }
  cardFront.textContent = cards[currentIndex].question;
  cardBack.textContent = cards[currentIndex].answer;
  progress.textContent = `Card ${currentIndex + 1} of ${cards.length}`;
  flashcard.classList.remove("flipped");
}

// Flip card
flashcard.addEventListener("click", () => {
  flashcard.classList.toggle("flipped");
});

// Next card
function nextCard() {
  if (cards.length === 0) return;
  currentIndex = (currentIndex + 1) % cards.length;
  showCard();
}

// Previous card
function prevCard() {
  if (cards.length === 0) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  showCard();
}

// Add new card
function addCard() {
  const q = document.getElementById("newQuestion").value.trim();
  const a = document.getElementById("newAnswer").value.trim();
  if (q && a) {
    cards.push({ question: q, answer: a });
    currentIndex = cards.length - 1; // show the new card
    showCard();
    document.getElementById("newQuestion").value = "";
    document.getElementById("newAnswer").value = "";
  }
}

// Delete current card
function deleteCard() {
  if (cards.length === 0) return;
  cards.splice(currentIndex, 1);
  if (currentIndex >= cards.length) {
    currentIndex = cards.length - 1;
  }
  showCard();
}

// Initialize
showCard();
