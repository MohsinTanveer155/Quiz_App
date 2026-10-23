function escapePdfText(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(value, maxLength = 82) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function buildPdf(lines) {
  const commands = ["BT", "/F1 11 Tf", "50 790 Td", "15 TL"];
  lines.forEach((line, index) => {
    if (index > 0) commands.push("T*");
    commands.push(`(${escapePdfText(line)}) Tj`);
  });
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export function createResultsPdf({ score, correctCount, questionCount, results, durationSeconds }) {
  const lines = [
    "QUIZLET - WEB FUNDAMENTALS",
    "Your quiz results",
    "",
    `Score: ${score} / ${questionCount * 10}`,
    `Correct answers: ${correctCount} / ${questionCount}`,
    `Time used: ${durationSeconds} seconds`,
    "",
    "ANSWER REVIEW",
    ""
  ];

  results.forEach(({ question, selectedAnswer, isCorrect }, index) => {
    lines.push(...wrapText(`${index + 1}. ${question.prompt}`));
    lines.push(...wrapText(`Your answer: ${selectedAnswer ?? "Not answered"}${isCorrect ? " (Correct)" : ""}`));
    if (!isCorrect) {
      lines.push(...wrapText(`Correct answer: ${question.correctAnswer}`));
      lines.push(...wrapText(`Explanation: ${question.explanation}`));
    }
    lines.push("");
  });

  return buildPdf(lines);
}

export function downloadResultsPdf(result) {
  const blob = createResultsPdf(result);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quizlet-results.pdf";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
