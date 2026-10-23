import { questionBank, QUESTION_COUNT, QUIZ_DURATION_SECONDS } from "./questions.js";
import { QuizEngine } from "./quiz-engine.js";
import { downloadResultsPdf } from "./pdf-export.js";

const engine = new QuizEngine(questionBank);
const elements = {
  root: document.documentElement,
  quizCard: document.querySelector(".quiz-card"),
  resultCard: document.querySelector("#result-card"),
  questionCount: document.querySelector("#question-count strong"),
  questionTitle: document.querySelector("#quiz-title"),
  questionFeedback: document.querySelector("#question-feedback"),
  options: [...document.querySelectorAll(".option-card")],
  progressBar: document.querySelector(".segmented-progress"),
  progressSegments: [...document.querySelectorAll(".progress-segment")],
  timerRing: document.querySelector("#timer-ring"),
  timerValue: document.querySelector("#timer-value"),
  nextButton: document.querySelector("#next-button"),
  nextLabel: document.querySelector("#next-label"),
  skipButton: document.querySelector("#skip-button"),
  themeToggle: document.querySelector(".theme-toggle")
};

let remainingSeconds = QUIZ_DURATION_SECONDS;
let timerId = null;
let startedAt = Date.now();

function renderQuestion() {
  const question = engine.currentQuestion;
  const savedAnswer = engine.answers[engine.currentIndex];

  elements.questionCount.textContent = String(engine.currentIndex + 1).padStart(2, "0");
  elements.questionTitle.textContent = question.prompt;
  elements.questionFeedback.textContent = savedAnswer
    ? savedAnswer.isCorrect
      ? "Correct! " + question.explanation
      : `Not quite. Correct answer: ${question.correctAnswer}. ${question.explanation}`
    : "Choose the best answer to continue.";
  elements.questionFeedback.className = "question-subtitle question-feedback";
  if (savedAnswer) {
    elements.questionFeedback.classList.add(savedAnswer.isCorrect ? "is-correct" : "is-incorrect");
  }

  question.answers.forEach((answer, index) => {
    const option = elements.options[index];
    option.querySelector(".option-letter").textContent = String.fromCharCode(65 + index);
    option.querySelector(".option-text").textContent = answer;
    option.dataset.answer = answer;
    option.disabled = Boolean(savedAnswer);
    option.setAttribute("aria-pressed", String(savedAnswer?.selectedAnswer === answer));
    option.classList.toggle("is-selected", savedAnswer?.selectedAnswer === answer);
    option.classList.toggle("is-correct", Boolean(savedAnswer) && answer === question.correctAnswer);
    option.classList.toggle(
      "is-incorrect",
      Boolean(savedAnswer) && savedAnswer.selectedAnswer === answer && !savedAnswer.isCorrect
    );
  });

  elements.progressBar.setAttribute("aria-valuenow", String(engine.answeredCount));
  elements.progressBar.setAttribute(
    "aria-label",
    `Quiz progress: ${engine.answeredCount} of ${QUESTION_COUNT} questions completed`
  );
  elements.progressSegments.forEach((segment, index) => {
    segment.classList.remove("is-current", "is-complete", "is-correct", "is-incorrect", "is-skipped");
    const answer = engine.answers[index];
    if (answer?.isSkipped) segment.classList.add("is-skipped");
    else if (answer) segment.classList.add(answer.isCorrect ? "is-correct" : "is-incorrect");
    else if (index === engine.currentIndex) segment.classList.add("is-current");
  });

  elements.nextButton.disabled = !savedAnswer;
  elements.nextLabel.textContent = engine.currentIndex === QUESTION_COUNT - 1
    ? "See results"
    : "Next question";
}

function chooseAnswer(answer) {
  if (!engine.chooseAnswer(answer)) return;
  renderQuestion();
}

function updateTimer() {
  elements.timerValue.textContent = String(remainingSeconds);
  elements.timerRing.setAttribute("aria-label", `${remainingSeconds} seconds remaining`);
  elements.timerRing.classList.toggle("is-warning", remainingSeconds <= 10);
  const progress = remainingSeconds / QUIZ_DURATION_SECONDS;
  document.querySelector(".timer-progress").style.strokeDashoffset = String(126 * (1 - progress));
}

function startTimer() {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    remainingSeconds -= 1;
    updateTimer();
    if (remainingSeconds <= 0) {
      engine.skipCurrentQuestion();
      advanceQuestion(true);
    }
  }, 1000);
}

function advanceQuestion(timedOut = false) {
  if (timedOut) {
    elements.questionFeedback.textContent = "Time is up for this question. Moving on...";
    elements.questionFeedback.className = "question-subtitle question-feedback is-timeout";
  }

  const result = engine.advance();
  if (result === "completed") {
    finishQuiz(timedOut);
    return;
  }
  if (result) {
    remainingSeconds = QUIZ_DURATION_SECONDS;
    updateTimer();
    renderQuestion();
  }
}

function skipQuestion() {
  if (engine.completed || !engine.skipCurrentQuestion()) return;
  advanceQuestion();
}

function finishQuiz(timedOut = false) {
  window.clearInterval(timerId);
  engine.finish();
  renderResults(timedOut);
}

function renderResults(timedOut) {
  const results = engine.getResults();
  const correctCount = engine.correctCount;
  const skippedCount = engine.skippedCount;
  const wrongCount = QUESTION_COUNT - correctCount - skippedCount;
  const percentage = Math.round((correctCount / QUESTION_COUNT) * 100);

  document.querySelector("#score-percent").textContent = String(percentage);
  document.querySelector("#score-detail").textContent = `${correctCount} out of ${QUESTION_COUNT} correct`;
  document.querySelector("#correct-count").textContent = String(correctCount).padStart(2, "0");
  document.querySelector("#wrong-count").textContent = String(wrongCount).padStart(2, "0");
  document.querySelector("#skipped-count").textContent = String(skippedCount).padStart(2, "0");
  document.querySelector("#time-used").textContent = String(
    Math.max(0, Math.round((Date.now() - startedAt) / 1000))
  ).padStart(2, "0");

  document.querySelector("#result-eyebrow").textContent = timedOut ? "TIME'S UP" : "ROUND COMPLETE";
  document.querySelector("#result-title").textContent = percentage === 100
    ? "Perfect score!"
    : percentage >= 60
      ? "Brilliant work!"
      : "Keep practicing!";
  document.querySelector("#result-description").textContent = timedOut
    ? "The timer ran out. Review your results and give it another try."
    : "Your answers are in. Review your score and give the quiz another round.";

  elements.quizCard.classList.add("is-hidden");
  elements.resultCard.classList.remove("is-hidden");
  elements.resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
  document.querySelector("#download-button").onclick = () => downloadResultsPdf({
    score: engine.score,
    correctCount,
    questionCount: QUESTION_COUNT,
    results,
    durationSeconds: Math.round((Date.now() - startedAt) / 1000)
  });
}

function retryQuiz() {
  engine.reset(questionBank);
  remainingSeconds = QUIZ_DURATION_SECONDS;
  startedAt = Date.now();
  elements.quizCard.classList.remove("is-hidden");
  elements.resultCard.classList.add("is-hidden");
  updateTimer();
  renderQuestion();
  startTimer();
}

function initializeTheme() {
  const savedTheme = window.localStorage.getItem("quizmaster-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  elements.root.dataset.theme = theme;
  updateThemeToggle(theme);
  elements.themeToggle.addEventListener("click", () => {
    const nextTheme = elements.root.dataset.theme === "dark" ? "light" : "dark";
    elements.root.dataset.theme = nextTheme;
    window.localStorage.setItem("quizmaster-theme", nextTheme);
    updateThemeToggle(nextTheme);
  });
}

function updateThemeToggle(theme) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  elements.themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} appearance`);
  elements.themeToggle.title = `Switch to ${nextTheme} appearance`;
}

elements.options.forEach((option) => {
  option.addEventListener("click", () => chooseAnswer(option.dataset.answer));
});
elements.nextButton.addEventListener("click", () => advanceQuestion());
elements.skipButton.addEventListener("click", skipQuestion);
document.querySelector("#retry-button").addEventListener("click", retryQuiz);

initializeTheme();
updateTimer();
renderQuestion();
startTimer();
