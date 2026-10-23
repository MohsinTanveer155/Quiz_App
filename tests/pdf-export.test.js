import assert from "node:assert/strict";
import test from "node:test";
import { questionBank, QUESTION_COUNT } from "../scripts/questions.js";
import { createResultsPdf } from "../scripts/pdf-export.js";

test("generates a downloadable PDF containing the score and answer review", async () => {
  const question = questionBank[0];
  const pdf = createResultsPdf({
    score: 10,
    correctCount: 1,
    questionCount: QUESTION_COUNT,
    durationSeconds: 12,
    results: [{
      question,
      selectedAnswer: question.correctAnswer,
      isCorrect: true
    }]
  });
  const content = await pdf.text();

  assert.equal(pdf.type, "application/pdf");
  assert.ok(content.startsWith("%PDF-1.4"));
  assert.ok(content.includes("Score: 10 / 50"));
  assert.ok(content.includes(question.prompt));
  assert.ok(content.includes("xref"));
  assert.ok(content.endsWith("%%EOF"));
});
