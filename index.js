document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Load data from localStorage
  // =========================
  let cards = JSON.parse(localStorage.getItem('userCards') || '[]');
  let progress = JSON.parse(localStorage.getItem('progress') || '{}');
  let quizScores = JSON.parse(localStorage.getItem('quizScores') || '{}');

  // =========================
  // SAMPLE CARDS (Home Section)
  // =========================
  const sampleContainer = document.getElementById('sampleCards');
  if (sampleContainer) {
    const sampleCards = [
      { q: 'Bonjour means?', a: 'Hello (French)' },
      { q: 'Derivative of x^2?', a: '2x' },
      { q: 'Capital of France?', a: 'Paris' }
    ];
    sampleCards.forEach(card => {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <div class="flashcard">
          <div class="flashcard-inner">
            <div class="flashcard-face flashcard-front">
              <h5>Question</h5>
              <p>${card.q}</p>
              <span class="flip-label">Flip me</span>
            </div>
            <div class="flashcard-face flashcard-back">
              <h5>Answer</h5>
              <p>${card.a}</p>
            </div>
          </div>
        </div>
      `;
      sampleContainer.appendChild(col);
    });
    sampleContainer.querySelectorAll('.flashcard').forEach(fc => {
      fc.addEventListener('click', () => fc.classList.toggle('flip'));
    });
  }

  // =========================
  // YOUR CARDS SECTION
  // =========================
  const form = document.getElementById('createForm');
  const container = document.getElementById('userCards');

  function renderCards() {
    if (!container) return;
    container.innerHTML = '';

    const grouped = {};
    cards.forEach((c, i) => {
      if (!grouped[c.category]) grouped[c.category] = [];
      grouped[c.category].push({ ...c, index: i });
    });

    Object.entries(grouped).forEach(([category, list]) => {
      const block = document.createElement('div');
      block.className = 'category-block mb-4';
      block.innerHTML = `
        <h4 class="category-title">${category}</h4>
        <div class="row g-3"></div>
      `;
      container.appendChild(block);

      const catContainer = block.querySelector('.row');
      list.forEach(card => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
          <div class="flashcard" data-index="${card.index}">
            <div class="flashcard-inner">
              <div class="flashcard-face flashcard-front">
                <h5>Question</h5>
                <p>${card.q}</p>
                <span class="flip-label">Flip me</span>
              </div>
              <div class="flashcard-face flashcard-back">
                <h5>Answer</h5>
                <p>${card.a}</p>
              </div>
            </div>
          </div>
          <div class="mt-2 d-flex gap-2">
            <label><input type="checkbox" class="known-check" data-index="${card.index}"> Known</label>
            <label><input type="checkbox" class="unknown-check" data-index="${card.index}"> Unknown</label>
            <button class="btn btn-sm btn-danger remove-btn" data-index="${card.index}">Remove</button>
          </div>
        `;
        catContainer.appendChild(col);
      });
    });

    container.querySelectorAll('.flashcard').forEach(fc => {
      fc.addEventListener('click', () => fc.classList.toggle('flip'));
    });

    container.querySelectorAll('.known-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const i = chk.dataset.index;
        progress[i] = progress[i] || {};
        progress[i].known = chk.checked;
        if (chk.checked) {
          progress[i].unknown = false;
          const unknownChk = container.querySelector(`.unknown-check[data-index="${i}"]`);
          if (unknownChk) unknownChk.checked = false;
        }
        localStorage.setItem('progress', JSON.stringify(progress));
        renderProgress();
      });
    });

    container.querySelectorAll('.unknown-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const i = chk.dataset.index;
        progress[i] = progress[i] || {};
        progress[i].unknown = chk.checked;
        if (chk.checked) {
          progress[i].known = false;
          const knownChk = container.querySelector(`.known-check[data-index="${i}"]`);
          if (knownChk) knownChk.checked = false;
        }
        localStorage.setItem('progress', JSON.stringify(progress));
        renderProgress();
      });
    });

    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.dataset.index;
        cards.splice(i, 1);
        localStorage.setItem('userCards', JSON.stringify(cards));
        renderCards();
        renderProgress();
      });
    });
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('question').value;
      const a = document.getElementById('answer').value;
      const category = document.getElementById('category').value;
      cards.push({ q, a, category });
      localStorage.setItem('userCards', JSON.stringify(cards));
      form.reset();
      renderCards();
      renderProgress();
    });
  }

  renderCards();

 // =========================
// QUIZ SECTION
// =========================
const quizCategories = document.getElementById('quizCategories');
const quizContainer = document.getElementById('quizContainer');

function renderQuizCategories() {
  if (!quizCategories) return;
  quizCategories.innerHTML = '';
  const categories = [...new Set(cards.map(c => c.category))];
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary m-1';
    btn.textContent = cat;
    btn.addEventListener('click', () => startQuiz(cat));
    quizCategories.appendChild(btn);
  });
}

function startQuiz(category) {
  const categoryCards = cards.filter(
    c => c.category.toLowerCase() === category.toLowerCase()
  );

  if (categoryCards.length === 0) {
    quizContainer.innerHTML = `<p>No cards in this category yet.</p>`;
    return;
  }

  let current = 0;
  let score = 0;
  const total = categoryCards.length;

  function showQuestion() {
    const card = categoryCards[current];
    quizContainer.innerHTML = `
      <div class="quiz-question fw-bold mb-2">Q${current + 1}: ${card.q}</div>
      <input type="text" id="quizAnswer" class="form-control mb-2" placeholder="Type your answer">
      <button id="submitAnswer" class="btn btn-primary">Submit</button>
      <div id="quizFeedback" class="quiz-feedback mt-2"></div>
      <div class="progress mb-3 mt-3">
        <div id="quizProgress" class="progress-bar bg-success" role="progressbar" style="width: 0%">0%</div>
      </div>
      <div id="quizScore" class="mb-3 fw-bold text-primary"></div>
    `;

    const submitBtn = document.getElementById('submitAnswer');
    const feedback = document.getElementById('quizFeedback');
    const answerInput = document.getElementById('quizAnswer');

    submitBtn.addEventListener('click', () => {
      const userAns = answerInput.value.trim().toLowerCase();
      const correctAns = card.a.trim().toLowerCase();

      if (userAns === correctAns) {
        score++;
        current++;
        updateProgressBar();
        if (current < total) {
          showQuestion(); // next question
        } else {
          quizContainer.innerHTML = `
            <h4 class="text-success">Quiz Finished!</h4>
            <p class="fw-bold">Your Final Score: ${score} / ${total}</p>
          `;
          quizScores[category] = `${score} / ${total}`;
          localStorage.setItem('quizScores', JSON.stringify(quizScores));
          renderProgress();
        }
      } else {
        feedback.textContent = "Try again!";
        feedback.style.color = "red";
      }
    });
  }

  function updateProgressBar() {
    const percent = Math.round((current / total) * 100);
    const bar = document.getElementById('quizProgress');
    if (bar) {
      bar.style.width = percent + '%';
      bar.textContent = percent + '%';
      bar.setAttribute('aria-valuenow', percent);
    }
    const scoreText = document.getElementById('quizScore');
    if (scoreText) {
      scoreText.textContent = `Score: ${score} / ${total}`;
    }
  }

  updateProgressBar();
  showQuestion();
}
  renderQuizCategories();

  // =========================
  // PROGRESS TRACKER SECTION
  // =========================
  const overallProgress = document.getElementById('overallProgress');
  const categoryProgress = document.getElementById('categoryProgress');

  function renderProgress() {
  if (!overallProgress || !categoryProgress) return;

  const totalCards = cards.length;
  let knownCount = 0, unknownCount = 0, unmarkedCount = 0;

  // Count based on actual cards array
  cards.forEach((c, i) => {
    if (progress[i]?.known) {
      knownCount++;
    } else if (progress[i]?.unknown) {
      unknownCount++;
    } else {
      unmarkedCount++;
    }
  });

  // Overall stats
  overallProgress.innerHTML = `
    <h5>Overall Progress</h5>
    <p>Known: ${knownCount} | Unknown: ${unknownCount} | Unmarked: ${unmarkedCount} | Total: ${totalCards}</p>
  `;

  // Category scores (quiz results)
  categoryProgress.innerHTML = '<h5>Category Scores</h5>';
  if (Object.keys(quizScores).length === 0) {
    categoryProgress.innerHTML += `<p>No quiz attempted yet.</p>`;
  } else {
    Object.entries(quizScores).forEach(([cat, score]) => {
      const p = document.createElement('p');
      p.textContent = `${cat}: ${score}`;
      categoryProgress.appendChild(p);
    });
  }

  // ====== Charts ======
  const barCtx = document.getElementById('progressBarChart')?.getContext('2d');
  const pieCtx = document.getElementById('progressPieChart')?.getContext('2d');

  if (barCtx && pieCtx) {
    if (window.barChart) window.barChart.destroy();
    if (window.pieChart) window.pieChart.destroy();

    // Bar chart
    window.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Known', 'Unknown', 'Unmarked'],
        datasets: [{
          label: 'Cards',
          data: [knownCount, unknownCount, unmarkedCount],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, precision: 0 } }
      }
    });

    // Pie chart
    window.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Known', 'Unknown', 'Unmarked'],
        datasets: [{
          data: [knownCount, unknownCount, unmarkedCount],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
        }]
      },
      options: { responsive: true }
    });
  }
}
    renderProgress();
});
// =========================
// NAVIGATION SECTION
// =========================
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);

    // Hide all sections
    document.querySelectorAll('section').forEach(sec => {
      sec.style.display = 'none';
    });

    // Show selected section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.style.display = 'block';
    }

    // Active link highlight
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    link.classList.add('active');
  });
});

// By default show home section only
document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
document.getElementById('home').style.display = 'block';