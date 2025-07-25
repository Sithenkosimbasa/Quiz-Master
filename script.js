let questionCount = 0;

function addQuestion() {
  const builder = document.getElementById('questionBuilder');
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-block';

  questionDiv.dataset.answerType = 'multiple-choice'; // default type

  questionDiv.innerHTML = `
    <h3>Question ${questionCount + 1}</h3>

    <label>Question Text:</label>
    <input type="text" placeholder="Enter question text" class="question-text" />

    <label>Answer Type:</label>
    <select class="answer-type" onchange="updateAnswerInputs(this)">
      <option value="multiple-choice" selected>Multiple Choice</option>
      <option value="slider">Slider</option>
      <option value="text">Text Input</option>
    </select>

    <div class="answer-inputs">
      <!-- Multiple choice inputs as default -->
      <input type="text" placeholder="Option A" class="option" data-opt="a" />
      <input type="text" placeholder="Option B" class="option" data-opt="b" />
      <input type="text" placeholder="Option C" class="option" data-opt="c" />
      <label>Correct Answer:
        <select class="correct-answer">
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
        </select>
      </label>
    </div>
    <hr />
  `;

  builder.appendChild(questionDiv);
  questionCount++;
}

function updateAnswerInputs(selectElem) {
  const questionDiv = selectElem.closest('.question-block');
  const type = selectElem.value;
  questionDiv.dataset.answerType = type;

  const container = questionDiv.querySelector('.answer-inputs');

  // Clear current inputs
  container.innerHTML = '';

  if (type === 'multiple-choice') {
    containe
