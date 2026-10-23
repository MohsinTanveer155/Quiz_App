# Quiz_App — Web Fundamentals Quiz

A responsive, browser-based web fundamentals quiz built with semantic HTML, custom CSS, Bootstrap 5, and native JavaScript modules. It presents five randomized questions per round, provides instant answer feedback, and summarizes results when the round ends.

## Features

- **Randomized rounds:** Five questions are selected from a 12-question bank, and answer choices are shuffled. Consecutive rounds avoid repeating questions.
- **Timed questions:** Each question has a 60-second countdown. When time expires, the unanswered question is recorded and the quiz moves on.
- **Answer feedback:** Selected answers are marked correct or incorrect, with an explanation.
- **Question navigation:** Continue after answering, or skip a question.
- **Progress tracking:** A five-segment progress bar shows completed, correct, incorrect, skipped, and current questions.
- **Results summary:** View your score, correct and incorrect answers, skipped questions, and elapsed time.
- **PDF export:** Download a PDF summary with your score and answer review.
- **Appearance preference:** Switch between light and dark themes; your selection is saved in local storage.
- **Responsive layout:** Quiz controls and cards adapt to desktop, tablet, and mobile screens.

## Getting started

### Requirements

- A modern web browser
- Python 3 (for the local development server)
- Node.js (to run the test suite)

### Run the app

Open a terminal in the project folder and start a local server:

```bash
npm start
```

Then open [http://localhost:8000](http://localhost:8000).

Alternatively, run the server directly:

```bash
python -m http.server 8000
```

The project uses JavaScript ES modules, so serve it over HTTP rather than opening `index.html` directly as a `file://` URL.

### Run tests

```bash
npm test
```

The tests cover randomized question selection, answer recording and scoring, skipped questions, round completion, and PDF generation.

## Playing a round

1. Select one of the four answer cards. The quiz immediately displays whether the answer was correct and shows an explanation.
2. Choose **Next question** to continue, or **Skip question** to leave it unanswered.
3. Each question has its own 60-second timer. If the timer expires, the question is skipped automatically.
4. After the fifth question, review your results. Choose **Download PDF** to save them or **Retry Quiz** to start a new round.

## Project structure

```text
.
├── index.html                 # Semantic page structure and quiz/result cards
├── style.css                  # Design system, themes, and responsive layout
├── package.json               # Start and test scripts
├── scripts/
│   ├── app.js                 # DOM rendering and browser interaction
│   ├── questions.js           # Question bank and quiz constants
│   ├── quiz-engine.js         # Round selection, answers, progress, and scoring
│   └── pdf-export.js          # Client-side PDF creation and download
└── tests/
    ├── quiz-engine.test.js    # Quiz state and scoring tests
    └── pdf-export.test.js     # PDF output test
```

## Technologies

- HTML5 and CSS3
- Bootstrap 5 stylesheet via CDN
- Vanilla JavaScript ES modules
- Node.js built-in test runner

No application build step or third-party JavaScript dependencies are required.

## Author

- **Name:** Mohsin Tanveer
- **Registration number:** FA23-BSE-004
- **GitHub:** [MohsinTanveer155](https://github.com/MohsinTanveer155)
