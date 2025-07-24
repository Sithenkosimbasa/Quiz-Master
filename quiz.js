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

// Load questions
quizData.questions.forEach((q, i) => {
  const qBlock = document.createElement("div");
  qBlock.className = "question-block";
  qBlock.innerHTML = `
    <h3>Q${i + 1}: ${q.text}</h3>
    ${Object.entries(q.options).map(([key, val]) => `
      <label>
        <input type="radio" name="q${i}" value="${key}"/> ${val}
      </label><br/>
    `).join('')}
    <hr/>
  `;
  quizForm.appendChild(qBlock);
});

// Add Submit Button
const submitBtn = document.createElement("button");
submitBtn.type = "submit";
submitBtn.textContent = "Submit Quiz";
quizForm.appendChild(submitBtn);

// Timer Logic
const timeDisplay = document.getElementById("time");
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
  quizForm.dispatchEvent(new Event("submit"));
}

// Form Submission
quizForm.addEventListener("submit", function (e) {
  e.preventDefault();
  clearInterval(timerInterval);

  let score = 0;

  quizData.questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value === q.correct) {
      score++;
    }
  });

  quizForm.style.display = "none";
  resultBox.innerHTML = `
    <h2>Your Score: ${score} / ${quizData.questions.length}</h2>
    ${score === quizData.questions.length
      ? "🎉 Excellent work!"
      : score >= quizData.questions.length / 2
      ? "👍 Not bad, you’re getting there!"
      : "😅 Keep practicing!"}
  `;
});
