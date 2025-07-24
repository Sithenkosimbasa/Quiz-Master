let questionCount = 0;

function addQuestion() {
  const builder = document.getElementById('questionBuilder');
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-block';
  questionDiv.innerHTML = `
    <h3>Question ${questionCount + 1}</h3>
    <input type="text" placeholder="Enter question text" class="question-text"/>
    <input type="text" placeholder="Option A" class="option" data-opt="a"/>
    <input type="text" placeholder="Option B" class="option" data-opt="b"/>
    <input type="text" placeholder="Option C" class="option" data-opt="c"/>
    <label>Correct Answer:
      <select class="correct-answer">
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </select>
    </label>
    <hr/>
  `;
  builder.appendChild(questionDiv);
  questionCount++;
}

function generateQuiz() {
  const questions = [];
  const blocks = document.querySelectorAll('.question-block');

  blocks.forEach(block => {
    const text = block.querySelector('.question-text').value;
    const opts = block.querySelectorAll('.option');
    const correct = block.querySelector('.correct-answer').value;

    const options = {};
    opts.forEach(opt => {
      options[opt.dataset.opt] = opt.value;
    });

    questions.push({ text, options, correct });
  });

  const timer = parseInt(document.getElementById('timer').value);
  const quizData = { questions, timer };

  const quizID = 'quiz_' + Date.now();
  localStorage.setItem(quizID, JSON.stringify(quizData));

  const quizLink = `${location.origin}/quiz.html?id=${quizID}`;
  document.getElementById('quizLink').value = quizLink;

  // Show QR
  QRCode.toCanvas(document.getElementById('qrCanvas'), quizLink, function (error) {
    if (error) console.error(error);
  });

  document.getElementById('shareArea').style.display = 'block';
}
