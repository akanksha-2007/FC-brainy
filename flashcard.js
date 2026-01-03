// Default flashcards
let cards = [
  { question: "What is the capital of India?", answer: "New Delhi" },
  { question: "What does HTML stand for?", answer: "HyperText Markup Language" },
  { question: "22*22?", answer: "484"},
  { question: "What is the fastest land animal?", answer: " Cheetah" },
  { question: "Who painted the Mona Lisa?", answer: " Leonardo da Vinci" },
  { question: "Who was the first person to walk on the moon?", answer: " Neil Armstrong" },
  { question: " In which year did India gain independence?", answer: "1947" },
  { question: "What is the chemical symbol for water?", answer: " H₂O" },
  { question: "Who wrote the play Romeo and Juliet?", answer: "William Shakespeare" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
  { question: "Who invented the light bulb?", answer: "Thomas Elva Edision" },
  { question: " What is the only country that has a flag not shaped as a rectangle?", answer: "Nepal" },
  { question: "Which planet spins on its side, making its seasons extreme?", answer: "Uranus" },
  { question: " I speak without a mouth and hear without ears. What am I?", answer: "An echo" },
  { question: "The more you take away from me, the bigger I get. What am I?", answer: "A hole" },
  { question: " Who painted the ceiling of the Sistine Chapel?", answer: "Michelangelo" },
  { question: "Which ancient wonder was located in Babylon?", answer: " The Hanging Gardens" },
  { question: " What is the hardest natural substance on Earth?", answer: "Diamond" },
  { question: " Which animal can sleep for up to 3 years?", answer: "Snail" },
  { question: "What fruit was once called a “Persian apple,” giving rise to its modern name?", answer: "Peach" },
]

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
