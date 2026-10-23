import { POINTS_PER_QUESTION, QUESTION_COUNT } from "./questions.js";

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export class QuizEngine {
  constructor(questionBank, questionCount = QUESTION_COUNT) {
    if (questionBank.length < questionCount) {
      throw new Error(`The question bank must contain at least ${questionCount} questions.`);
    }
    this.questionCount = questionCount;
    this.questions = [];
    this.answers = [];
    this.currentIndex = 0;
    this.completed = false;
    this.reset(questionBank);
  }

  reset(questionBank) {
    const previousPrompts = new Set(this.questions.map(({ prompt }) => prompt));
    const freshQuestions = questionBank.filter(({ prompt }) => !previousPrompts.has(prompt));
    const candidates = freshQuestions.length >= this.questionCount
      ? freshQuestions
      : questionBank;

    this.questions = shuffle(candidates).slice(0, this.questionCount).map((question) => ({
      ...question,
      answers: shuffle(question.answers)
    }));
    this.answers = Array(this.questionCount).fill(null);
    this.currentIndex = 0;
    this.completed = false;
  }

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  get score() {
    return this.answers.reduce((total, answer, index) => (
      answer?.isCorrect ? total + POINTS_PER_QUESTION : total
    ), 0);
  }

  get correctCount() {
    return this.answers.filter((answer) => answer?.isCorrect).length;
  }

  get skippedCount() {
    return this.answers.filter((answer) => answer?.isSkipped).length;
  }

  get answeredCount() {
    return this.answers.filter((answer) => answer !== null).length;
  }

  get progress() {
    return this.answeredCount;
  }

  chooseAnswer(answer) {
    if (this.completed || this.answers[this.currentIndex] !== null) return false;
    const isCorrect = answer === this.currentQuestion.correctAnswer;
    this.answers[this.currentIndex] = { selectedAnswer: answer, isCorrect, isSkipped: false };
    return true;
  }

  skipCurrentQuestion() {
    if (this.completed || this.answers[this.currentIndex] !== null) return false;
    this.answers[this.currentIndex] = { selectedAnswer: null, isCorrect: false, isSkipped: true };
    return true;
  }

  advance() {
    if (this.completed || this.answers[this.currentIndex] === null) return false;
    if (this.currentIndex === this.questionCount - 1) {
      this.completed = true;
      return "completed";
    }
    this.currentIndex += 1;
    return true;
  }

  finish() {
    this.completed = true;
  }

  getResults() {
    return this.questions.map((question, index) => ({
      question,
      selectedAnswer: this.answers[index]?.selectedAnswer ?? null,
      isCorrect: this.answers[index]?.isCorrect ?? false,
      isSkipped: this.answers[index]?.isSkipped ?? false
    }));
  }
}
