let questions = [];

function addQuestion() {
    const container = document.getElementById('questionBuilder');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your question...';
    input.className = 'question';
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}

function generateQuiz() {
    const timer = document.getElementById('timer').value;
    const questionInputs = document.querySelectorAll('.question');
    questions = Array.from(questionInputs).map(input => input.value);

    const quizData = {
        timer: timer,
        questions: questions
    };

    const encodedData = encodeURIComponent(JSON.stringify(quizData));
    const link = `http://127.0.0.1:5500/quiz.html?data=${encodedData}`;

    document.getElementById('quizLink').value = link;
    document.getElementById('shareArea').style.display = 'block';

    // Generate QR Code
    const qrCanvas = document.getElementById('qrCanvas');
    QRCode.toCanvas(qrCanvas, link, function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
    });
}
