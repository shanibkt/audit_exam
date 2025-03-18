let currentSet = 0; // Tracks current set of questions
let questions = []; // Will hold all questions from the JSON file
let correctCount = 0; // Tracks the number of correct answers in the current set

// Load questions from JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadSet(currentSet);
    });

// Load a set of questions
function loadSet(setIndex) {
    correctCount = 0; // Reset correct count for the new set
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const start = setIndex * 50;
    const end = start + (setIndex === 2 ? 30 : 50);
    const setQuestions = shuffleArray(questions.slice(start, end));

    setQuestions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            ${question.options.map((option, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${i}"> ${option}
                </label>
            `).join('')}
        `;
        questionContainer.appendChild(questionElement);
    });

    document.getElementById('submit-btn').disabled = false;
}

// Handle question submission
document.getElementById('submit-btn').addEventListener('click', () => {
    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach((element, index) => {
        const selectedOption = element.querySelector('input[type="radio"]:checked');
        const isCorrect = selectedOption && parseInt(selectedOption.value) === questions[currentSet * 50 + index].answer;
        if (isCorrect) {
            correctCount++; // Increment correct count if the answer is correct
        }
        element.style.border = isCorrect ? '2px solid green' : '2px solid red';
        if (!isCorrect) {
            const correctOption = element.querySelector(`input[value="${questions[currentSet * 50 + index].answer}"]`).parentElement;
            correctOption.style.backgroundColor = 'lightgreen';
        }
    });

    // Show score
    const totalQuestions = currentSet === 2 ? 30 : 50;
    alert(`Your score: ${correctCount}/${totalQuestions}`);

    document.getElementById('submit-btn').disabled = true;
});

// Load the next set of questions
document.getElementById('next-set-btn').addEventListener('click', () => {
    if (currentSet < 2) {
        currentSet++;
        loadSet(currentSet);
    }
});

// Utility function to shuffle an array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
