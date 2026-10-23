export const QUESTION_COUNT = 5;
export const QUIZ_DURATION_SECONDS = 60;
export const POINTS_PER_QUESTION = 10;

export const questionBank = [
  {
    category: "HTML",
    prompt: "Which HTML element is used for the largest level of heading?",
    answers: ["<h6>", "<heading>", "<h1>", "<head>"],
    correctAnswer: "<h1>",
    explanation: "The <h1> element represents the highest-level heading in a document."
  },
  {
    category: "CSS",
    prompt: "Which CSS property controls the space between an element's content and its border?",
    answers: ["margin", "padding", "gap", "outline"],
    correctAnswer: "padding",
    explanation: "Padding creates space inside an element, between its content and its border."
  },
  {
    category: "JAVASCRIPT",
    prompt: "Which array method creates a new array containing only items that pass a test?",
    answers: ["map()", "reduce()", "filter()", "forEach()"],
    correctAnswer: "filter()",
    explanation: "filter() returns a new array with only the elements that satisfy its callback."
  },
  {
    category: "HTML",
    prompt: "What is the purpose of the alt attribute on an image?",
    answers: ["Set its alignment", "Provide a text alternative", "Load it asynchronously", "Add a caption"],
    correctAnswer: "Provide a text alternative",
    explanation: "Alternative text communicates an image's meaning when it cannot be seen or loaded."
  },
  {
    category: "CSS",
    prompt: "Which layout system is designed for arranging items in a single dimension?",
    answers: ["CSS Grid", "Floats", "Flexbox", "Positioning"],
    correctAnswer: "Flexbox",
    explanation: "Flexbox lays out items along one axis; CSS Grid is designed for two-dimensional layouts."
  },
  {
    category: "JAVASCRIPT",
    prompt: "Which keyword declares a block-scoped variable that can be reassigned?",
    answers: ["const", "let", "static", "define"],
    correctAnswer: "let",
    explanation: "let declares a block-scoped variable whose value can be reassigned."
  },
  {
    category: "HTML",
    prompt: "Which attribute connects a label to a form input?",
    answers: ["name", "for", "target", "value"],
    correctAnswer: "for",
    explanation: "A label's for value should match the id of the input it describes."
  },
  {
    category: "CSS",
    prompt: "What does the CSS media query primarily help you create?",
    answers: ["Server-side styles", "Responsive designs", "Animated images", "Database themes"],
    correctAnswer: "Responsive designs",
    explanation: "Media queries apply styles conditionally, often based on viewport width or device settings."
  },
  {
    category: "JAVASCRIPT",
    prompt: "What does JSON.parse() do?",
    answers: ["Turns an object into a JSON string", "Converts a JSON string into a JavaScript value", "Validates HTML", "Downloads a file"],
    correctAnswer: "Converts a JSON string into a JavaScript value",
    explanation: "JSON.parse() reads a JSON-formatted string and returns the corresponding JavaScript value."
  },
  {
    category: "WEB BASICS",
    prompt: "Which protocol secures HTTP connections using encryption?",
    answers: ["FTP", "SMTP", "HTTPS", "SSH"],
    correctAnswer: "HTTPS",
    explanation: "HTTPS uses TLS to encrypt communication between the browser and a website."
  },
  {
    category: "JAVASCRIPT",
    prompt: "Which value represents the intentional absence of any object value in JavaScript?",
    answers: ["undefined", "NaN", "null", "false"],
    correctAnswer: "null",
    explanation: "null is an explicit value representing the intentional absence of an object value."
  },
  {
    category: "CSS",
    prompt: "Which unit is relative to the font size of the root element?",
    answers: ["em", "rem", "vh", "px"],
    correctAnswer: "rem",
    explanation: "A rem unit is relative to the root element's font size."
  }
];
