let questionCount = 0;

function addQuestion() {
  const answerType = document.getElementById('answerType').value;
  const builder = document.getElementById('questionBuilder');
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-block';

  let innerHTML = `<h3>Question ${questionCount + 1}</h3>
    <input type="text" placeholder="Enter question text" class="question-text" />`;

  if (answerType === 'multiple-choice') {
    innerHTML += `
      <input type="text" placeholder="Option A" class="option" data-opt="a" />
      <input type="text" placeholder="Option B" class="option" data-opt="b" />
      <input type="text" placeholder="Option C" class="option" data-opt="c" />
      <label>Correct Answer:
        <select class="correct-answer">
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
        </select>
      </label>`;
  } else if (answerType === 'slider') {
    innerHTML += `
      <label>Slider Min:
        <input type="number" class="slider-min" value="0" />
      </label>
      <label>Slider Max:
        <input type="number" class="slider-max" value="100" />
      </label>
      <label>Correct Value:
        <input type="number" class="slider-correct" value="50" />
      </label>`;
  } else if (answerType === 'text') {
    innerHTML += `
      <input type="text" placeholder="Correct Answer (text)" class="text-correct" />`;
  }

  questionDiv.innerHTML = innerHTML + `<hr />`;
  questionDiv.dataset.answerType = answerType;
  builder.appendChild(questionDiv);
  questionCount++;
}

function generateQuiz() {
  const questions = [];
  const blocks = document.querySelectorAll('.question-block');

  for (const block of blocks) {
    const text = block.querySelector('.question-text').value.trim();
    if (!text) {
      alert('Please fill out all question texts.');
      return;
    }

    const answerType = block.dataset.answerType;
    let questionData = { text, answerType };

    if (answerType === 'multiple-choice') {
      const opts = block.querySelectorAll('.option');
      let options = {};
      for (const opt of opts) {
        if (!opt.value.trim()) {
          alert('Please fill all multiple choice options.');
          return;
        }
        options[opt.dataset.opt] = opt.value.trim();
      }
      const correct = block.querySelector('.correct-answer').value;
      questionData.options = options;
      questionData.correct = correct;
    } else if (answerType === 'slider') {
      const min = Number(block.querySelector('.slider-min').value);
      const max = Number(block.querySelector('.slider-max').value);
      const correct = Number(block.querySelector('.slider-correct').value);
      if (isNaN(min) || isNaN(max) || isNaN(correct) || min >= max) {
        alert('Please enter valid slider values with min less than max.');
        return;
      }
      questionData.sliderRange = { min, max };
      questionData.correct = correct;
    } else if (answerType === 'text') {
      const correct = block.querySelector('.text-correct').value.trim();
      if (!correct) {
        alert('Please enter the correct text answer.');
        return;
      }
      questionData.correct = correct.toLowerCase();
    }

    questions.push(questionData);
  }

  const timer = parseInt(document.getElementById('timer').value);
  if (isNaN(timer) || timer < 10) {
    alert('Set a timer of at least 10 seconds.');
    return;
  }

  const quizData = { questions, timer };
  const quizID = 'quiz_' + Date.now();
  localStorage.setItem(quizID, JSON.stringify(quizData));

  const quizLink = `${location.origin}/quiz.html?id=${quizID}`;
  document.getElementById('quizLink').value = quizLink;

  QRCode.toCanvas(document.getElementById('qrCanvas'), quizLink, error => {
    if (error) console.error(error);
  });

  document.getElementById('shareArea').style.display = 'block';
}
