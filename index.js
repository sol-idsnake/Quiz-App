console.clear();
let count = 0;
let spanCount = 0;
let score = 0;

// set up initial Intro
function renderIntro() {
  $(".js-intro").show();
  $(".js-question").hide();
  $(".js-feedback").hide();
  $(".js-evaluation").hide();
}

// bind start quiz button
function renderQuestion() {
  $(".js-intro-submit").on("click", event => {
    event.preventDefault();
    renderQuestionForm();
  });
}

// updates DOM element with spanCount
function increaseSpanCount() {
  spanCount++;
  $(".js-question-counter").text(spanCount);
}

// create a reusable renderQuestion function
function renderQuestionForm() {
  increaseSpanCount();
  showOnlyQuestionDiv();
  $(".js-question").html(`
    <form id='form'>
    <fieldset>
    <legend><h2>${DB[count].question}</h2></legend>
    <div class='css-answers'>
		<input id='answer1' type="radio" name='answer' value='${DB[count].answers[0]}' required>
		<label for='answer1'>${DB[count].answers[0]}</label>
    </div>
    <div class='css-answers'>
    <input id='answer2' type="radio" name='answer' value='${DB[count].answers[1]}' required>
		<label for='answer2'>${DB[count].answers[1]}</label>
    </div>
    <div class='css-answers'>
    <input id='answer3' type="radio" name='answer' value='${DB[count].answers[2]}' required>
		<label for='answer3'>${DB[count].answers[2]}</label>
    </div>
    <div class='css-answers'>
    <input id='answer4' type="radio" name='answer' value='${DB[count].answers[3]}' required>
		<label for='answer4'>${DB[count].answers[3]}</label>
    </div>
    </fieldset>
    <div class="controls">
    <button class='button js-question-submit'>Submit</button>
    </div>
    </form>`);
}

// show only the question div
function showOnlyQuestionDiv() {
  $(".js-intro").hide();
  $(".js-feedback").hide();
  $(".js-question").show();
}

// Set event listener to submit the question; evaluate answer for correctness, call to render feedback
function submitQuestion() {
  $(".js-question").on("submit", event => {
    event.preventDefault();
    const value = fetchRadioValue(event);
    const answerIsCorrect = checkAnswer(value);
    const feedbackText = renderFeedbackText(answerIsCorrect);
    renderFeedback(feedbackText);
  });
}

// fetches the text value of the radio button
function fetchRadioValue(event) {
  let checkedRadioButton = $(event.currentTarget)
    .find("input:checked")
    .val();
  return checkedRadioButton;
}

// radio value is equal to correct answer in database
function checkAnswer(answer) {
  return answer === `${DB[count].correctAnswer}`;
}

// if statement returns rendered correct or incorrect answer text
function renderFeedbackText(correctAnswer) {
  let responseMsg = "";
  if (correctAnswer) {
    responseMsg = `<h2>Correct</h2>
                <p>On to the next.</p>
                <div class="controls">
                <button class='button js-feedback-submit'>Next</button>
                </div>`;
    increaseScoreCount();
  } else {
    responseMsg = `<h2>Ouch, this is not right</h2>
                <p>The correct answer is: '${DB[count].correctAnswer}'</p>
                <div class="controls">
                <button class='button js-feedback-submit'>Next</button>
                </div>`;
  }
  return responseMsg;
}

// increases score on correct answer
function increaseScoreCount() {
  score += 10;
  updateDomScore(count);
}

// updates DOM element with score
function updateDomScore(count) {
  $(".js-score-counter").text(score);
}

// function inserts correct/incorrect text into HTML
function renderFeedback(response) {
  $(".js-question").hide();
  $(".js-feedback")
    .show()
    .html(response);
  increaseDbCount();
}

// increases DB question index for renderQuestion
function increaseDbCount() {
  count++;
}

// feedback div button calls eval function
function submitFeedback() {
  $(".js-feedback").on("click", ".js-feedback-submit", () => {
    ifMaxQuestionIsReached();
  });
}

// evaluates if end of questions are reached. if so, call eval. if not, call renderquestionform
function ifMaxQuestionIsReached() {
  if (count === 10) {
    showEval();
    renderScore();
  } else {
    renderQuestionForm();
  }
}

// show eval div
function showEval() {
  $(".js-feedback").hide();
  $(".js-evaluation").show();
}

// renders eval text & final score
function renderScore() {
  $(".js-evaluation").html(`
  <h2>You did it!</h2>
  <h3>Your final score is ${score}.</h3>
  <h3>That is ${score/10} out of 10.</h3>
  <div class="controls">
  <button class='button js-button-reload'>Play again</button>
  </div>
  `);
}

//  binds reload functions to final eval div button
function reload() {
  $(".js-evaluation").on("click", ".js-button-reload", () => {
    resetAll();
    renderIntro();
  });
}

// resets all counters
function resetAll() {
  count = 0;
  spanCount = 0;
  score = 0;
  $(".js-question-counter").text(0);
  $(".js-score-counter").text(0);
}

function startApp() {
  renderIntro();
  renderQuestion();
  submitQuestion();
  submitFeedback();
  reload();
}

$(startApp);
