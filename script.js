let quizData = [];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];

// Fetch quiz data from QuizAPI
async function fetchQuizData() {
  try {
    // REPLACE WITH YOUR ACTUAL API KEY FROM quizapi.io
    const apiKey = 'jnkH7hx0NXzgsMuiYfqFqQbW68IS6AadPW0kuOkf';
    const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=code&limit=6`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map QuizAPI response to our quiz format
    quizData = data.map(q => {
      const options = [];
      let correctAnswer = '';
      
      // Process answers
      for (const [key, value] of Object.entries(q.answers)) {
        if (value) {
          options.push(value);
          if (q.correct_answers[`${key}_correct`] === "true") {
            correctAnswer = value;
          }
        }
      }
      
      return {
        question: q.question,
        options: options,
        answer: correctAnswer
      };
    });
    
    displayQuestion();
  } catch (error) {
    resultContainer.innerHTML = `
      <p>Failed to load quiz data. Please try again later.</p>
      <p>Error: ${error.message}</p>
    `;
    console.error('Error fetching quiz data:', error);
  }
}

// Shuffle options
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Display question
function displayQuestion() {
  if (quizData.length === 0) return;
  
  const questionData = quizData[currentQuestion];

  const questionHTML = `
    <div class="question">${currentQuestion + 1}. ${questionData.question}</div>
    <div class="options">
      ${shuffle([...questionData.options]).map(option => `
        <label class="option">
          <input type="radio" name="quiz" value="${option}">
          ${option}
        </label>
      `).join('')}
    </div>
  `;

  quizContainer.innerHTML = questionHTML;
}

// Check the selected answer
function checkAnswer() {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    if (answer === quizData[currentQuestion].answer) {
      score++;
    } else {
      incorrectAnswers.push({
        question: quizData[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: quizData[currentQuestion].answer
      });
    }
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      displayQuestion();
    } else {
      showResult();
    }
  } else {
    alert('Please select an answer!');
  }
}

// Show the result
function showResult() {
  quizContainer.style.display = 'none';
  submitButton.classList.add('hide');
  retryButton.classList.remove('hide');
  showAnswerButton.classList.remove('hide');
  resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
}

// Retry quiz
function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  incorrectAnswers = [];
  quizContainer.style.display = 'block';
  submitButton.classList.remove('hide');
  retryButton.classList.add('hide');
  showAnswerButton.classList.add('hide');
  resultContainer.innerHTML = '';
  displayQuestion();
}

// Show the correct answers
function showAnswers() {
  let answersHTML = incorrectAnswers.map(ia => `
    <div class="answer-item">
      <p><strong>Question:</strong> ${ia.question}</p>
      <p><strong>Your Answer:</strong> ${ia.incorrectAnswer}</p>
      <p><strong>Correct Answer:</strong> ${ia.correctAnswer}</p>
    </div>
  `).join('');
  
  resultContainer.innerHTML = `
    <p>You scored ${score} out of ${quizData.length}!</p>
    ${incorrectAnswers.length > 0 ? `
      <h3>Incorrect Answers:</h3>
      ${answersHTML}
    ` : '<p>Perfect! You got all answers correct!</p>'}
  `;
}

// Event listeners
submitButton.addEventListener('click', checkAnswer);
retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswers);

// Start the quiz
fetchQuizData();




//Joke generator
async function getFunnyJoke() {
  const jokeDiv = document.getElementById("joke");
  jokeDiv.textContent = "Loading joke...";

  try {
    const response = await fetch("https://official-joke-api.appspot.com/jokes/programming/random");
    const data = await response.json();

    const joke = data[0];
    jokeDiv.textContent = `${joke.setup} 🤓 ${joke.punchline}`;
  } catch (error) {
    jokeDiv.textContent = "Couldn't load a joke right now. Try again!";
  }
}