function getQuizID() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const quizID = getQuizID();
const quizData = JSON.parse(localStorage.getItem(quizID));

if (!quizData) {
  document.body.innerHTML = "<h2 style='text-align:center;'>Quiz not found ❌</h2>";
  throw new Error("Quiz not found");
}

const quizForm = document.getElementById("quizForm");
const resultBox = document.getElementById("result");
let timer = quizData.timer;
let timerInterval;

function renderMultipleChoice(q, index) {
  return `
    <h3>Q${index + 1}: ${q.text}</h3>
    ${Object.entries(q.options).map(([key, val]) => `
      <label class="mc-option">
        <input type="radio" name="q${index}" value="${key}" /> ${val}
      </label>
    `).join('')}
    <hr/>
  `;
}

function renderSlider(q, index) {
  return `
    <h3>Q${index + 1}: ${q.text}</h3>
    <input type="range" name="q${index}" min="${q.sliderRange.min}" max="${q.sliderRange.max}" value="${q.sliderRange.min}" />
    <span class="slider-value" id="sliderVal${index}">${q.sliderRange.min}</span>
    <hr/>
  `;
}

function renderTextInput(q, index) {
  return `
    <h3>Q${index + 1}: ${q.text}</h3>
    <input type="text" name="q${index}" />
    <hr/>
  `;
}

quizData.questions.forEach((q, i) => {
  let qHTML = '';
  if (q.answerType === 'multiple-choice') {
    qHTML = renderMultipleChoice(q, i);
  } else if (q.answerType === 'slider') {
    qHTML = renderSlider(q, i);
  } else if (q.answerType === 'text') {
    qHTML = renderTextInput(q, i);
  }
  const div = document.createElement('div');
  div.className = 'question-block';
  div.innerHTML = qHTML;
  quizForm.appendChild(div);

  // Add slider input event to update displayed value
  if (q.answerType === 'slider') {
    const sliderInput = div.querySelector('input[type=range]');
    const sliderDisplay = div.querySelector(`#sliderVal${i}`);
    sliderInput.addEventListener('input', () => {
      sliderDisplay.textContent = sliderInput.value;
    });
  }
});

// Submit button
const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.textContent = 'Submit Quiz';
quizForm.appendChild(submitBtn);

// Timer
const timeDisplay = document.getElementById('time');
timeDisplay.textContent = timer;

timerInterval = setInterval(() => {
  timer--;
  timeDisplay.textContent = timer;
  if (timer <= 0) {
    clearInterval(timerInterval);
    autoSubmitQuiz();
  }
}, 1000);

function autoSubmitQuiz() {
  quizForm.dispatchEvent(new Event('submit'));
}

quizForm.addEventListener('submit', e => {
  e.preventDefault();
  clearInterval(timerInterval);

  let score = 0;

  quizData.questions.forEach((q, i) => {
    const answerType = q.answerType;
    let userAnswer;

    if (answerType === 'multiple-choice') {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      userAnswer = selected ? selected.value : null;
      if (userAnswer === q.correct) score++;
    } else if (answerType === 'slider') {
      const sliderInput = document.querySelector(`input[name="q${i}"]`);
      userAnswer = sliderInput ? Number(sliderInput.value) : null;
      // Accept answer if within ±5 of correct slider value
      if (userAnswer !== null && Math.abs(userAnswer - q.correct) <= 5) score++;
    } else if (answerType === 'text') {
      const textInput = document.querySelector(`input[name="q${i}"]`);
      userAnswer = textInput ? textInput.value.trim().toLowerCase() : '';
      if (userAnswer === q.correct) score++;
    }
  });

  quizForm.style.display = 'none';
  resultBox.innerHTML = `
    <h2>Your Score: ${score} / ${quizData.questions.length}</h2>
    ${
      score === quizData.questions.length
        ? "🎉 Excellent work!"
        : score >= quizData.questions.length / 2
        ? "👍 Not bad, you’re getting there!"
        : "😅 Keep practicing!"
    }
  `;
});
