import assert from "node:assert/strict";
import test from "node:test";
import { questionBank, QUESTION_COUNT } from "../scripts/questions.js";
import { QuizEngine } from "../scripts/quiz-engine.js";

test("selects the configured number of unique questions", () => {
  const quiz = new QuizEngine(questionBank);

  assert.equal(quiz.questions.length, QUESTION_COUNT);
  assert.equal(new Set(quiz.questions.map(({ prompt }) => prompt)).size, QUESTION_COUNT);
  assert.ok(quiz.questions.every(({ answers, correctAnswer }) => answers.includes(correctAnswer)));
});

test("starts a fresh round without reusing questions from the previous round", () => {
  const quiz = new QuizEngine(questionBank);
  const previousPrompts = new Set(quiz.questions.map(({ prompt }) => prompt));

  quiz.reset(questionBank);

  assert.equal(quiz.questions.length, QUESTION_COUNT);
  assert.ok(quiz.questions.every(({ prompt }) => !previousPrompts.has(prompt)));
});

test("records answers, scores correct responses, and completes the last question", () => {
  const quiz = new QuizEngine(questionBank);

  for (let index = 0; index < QUESTION_COUNT; index += 1) {
    assert.equal(quiz.chooseAnswer(quiz.currentQuestion.correctAnswer), true);
    assert.equal(quiz.progress, index + 1);
    assert.equal(quiz.score, (index + 1) * 10);
    assert.equal(quiz.advance(), index === QUESTION_COUNT - 1 ? "completed" : true);
  }

  assert.equal(quiz.completed, true);
  assert.equal(quiz.correctCount, QUESTION_COUNT);
  assert.equal(quiz.getResults().length, QUESTION_COUNT);
});

test("does not replace an answer after it has been selected", () => {
  const quiz = new QuizEngine(questionBank);
  const { correctAnswer, answers } = quiz.currentQuestion;
  const incorrectAnswer = answers.find((answer) => answer !== correctAnswer);

  assert.equal(quiz.chooseAnswer(incorrectAnswer), true);
  assert.equal(quiz.chooseAnswer(correctAnswer), false);
  assert.equal(quiz.answers[0].selectedAnswer, incorrectAnswer);
  assert.equal(quiz.score, 0);
});

test("records skipped questions separately and counts them in progress", () => {
  const quiz = new QuizEngine(questionBank);

  assert.equal(quiz.skipCurrentQuestion(), true);
  assert.equal(quiz.progress, 1);
  assert.equal(quiz.skippedCount, 1);
  assert.equal(quiz.answers[0].selectedAnswer, null);
  assert.equal(quiz.advance(), true);
  assert.equal(quiz.currentIndex, 1);
});
