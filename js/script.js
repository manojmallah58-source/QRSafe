/* ==========================================
   QR CODE AWARENESS CEP - JAVASCRIPT
   Interactivity, Theme Switcher & Quiz Logic
   ========================================== */

// 1. Navigation / Section Switching Logic
function switchSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update Bottom Navigation Active State
    const navItems = document.querySelectorAll('.app-bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Map section IDs to bottom nav indexes or highlight based on click
    navItems.forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Dark / Light Mode Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
});

// 3. Interactive Safety Quiz Data & Logic
const quizData = [
    {
        question: "What is a QR code primarily made of?",
        options: [
            "A magnetic strip that stores encrypted pins",
            "A two-dimensional matrix barcode storing data pixels",
            "A fingerprint identifier image",
            "A live GPS tracking token"
        ],
        correct: 1,
        explanation: "A QR (Quick Response) code is a 2D matrix barcode readable by digital cameras to quickly retrieve embedded text or URL links."
    },
    {
        question: "Why should you never scan a QR code received from an unknown SMS offering free cash prizes?",
        options: [
            "Because it wastes your internet data",
            "It may lead to a phishing page designed to steal banking credentials",
            "It instantly deletes your mobile gallery",
            "QR codes cannot process prizes"
        ],
        correct: 1,
        explanation: "Unsolicited reward QR codes are a common scam tactic ('quishing') used to direct victims to fraudulent portals."
    },
    {
        question: "Is a UPI PIN required to RECEIVE money from someone using a QR code?",
        options: [
            "Yes, always required",
            "Only if the amount is greater than ₹5,000",
            "No, a UPI PIN is ONLY required when sending money",
            "Required only on weekends"
        ],
        correct: 2,
        explanation: "Remember the golden rule: You never need to enter a UPI PIN or password to receive funds."
    },
    {
        question: "What is 'Quishing'?",
        options: [
            "Quick online shopping via mobile apps",
            "Phishing attacks executed via malicious QR codes",
            "QR code printing errors",
            "A method to speed up payment transactions"
        ],
        correct: 1,
        explanation: "Quishing combines 'QR code' and 'phishing', representing fraudulent QR codes designed to steal data."
    },
    {
        question: "What should you check when scanning a payment QR code at a local shop counter?",
        options: [
            "Only the design color of the QR stand",
            "Whether a physical sticker has been pasted over the genuine merchant QR",
            "The battery level of your mobile phone",
            "The physical weight of the shop counter"
        ],
        correct: 1,
        explanation: "Scammers often place fake stickers over legitimate shop QR codes to divert payments to their own accounts."
    },
    {
        question: "If a QR code scanner app warns you about a suspicious, misspelled URL destination, what should you do?",
        options: [
            "Proceed anyway if the design looks neat",
            "Stop immediately and cancel the interaction",
            "Enter your password to bypass the warning",
            "Refresh the app three times"
        ],
        correct: 1,
        explanation: "Never ignore URL warnings or misspelled domains. Stop immediately if anything looks suspicious."
    },
    {
        question: "What is the recommended habit before authorizing any digital payment?",
        options: [
            "Verify the recipient's name and payment amount on the confirmation screen",
            "Share your screen with a customer care executive",
            "Turn off your phone location",
            "Close all background apps"
        ],
        correct: 0,
        explanation: "Always double-check who you are sending money to and how much before tapping send."
    },
    {
        question: "What is the official National Cyber Crime Helpline number in India for reporting financial fraud?",
        options: [
            "100",
            "108",
            "1930",
            "112"
        ],
        correct: 2,
        explanation: "1930 is the dedicated national cyber crime helpline number in India to report online financial fraud promptly."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;

const startScreen = document.getElementById('quiz-start-screen');
const questionScreen = document.getElementById('quiz-question-screen');
const resultScreen = document.getElementById('quiz-result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackDiv = document.getElementById('quiz-feedback');
const nextBtn = document.getElementById('next-btn');
const currentQSpan = document.getElementById('current-q');
const totalQSpan = document.getElementById('total-q');
const finalScoreSpan = document.getElementById('final-score');
const performanceMsg = document.getElementById('quiz-performance-msg');

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    totalQSpan.innerText = quizData.length;
    loadQuestion();
}

function loadQuestion() {
    answerSelected = false;
    feedbackDiv.classList.add('hidden');
    nextBtn.classList.add('hidden');
    
    currentQSpan.innerText = currentQuestionIndex + 1;
    const currentQ = quizData[currentQuestionIndex];
    questionText.innerText = currentQ.question;
    
    optionsContainer.innerHTML = '';
    currentQ.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedIndex, selectedBtn) {
    if (answerSelected) return; // Prevent multiple clicks
    answerSelected = true;

    const currentQ = quizData[currentQuestionIndex];
    const optionBtns = optionsContainer.querySelectorAll('.option-btn');

    if (selectedIndex === currentQ.correct) {
        selectedBtn.classList.add('correct');
        score++;
        feedbackDiv.style.backgroundColor = 'var(--success-bg)';
        feedbackDiv.style.color = 'var(--success)';
        feedbackDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Correct!</strong> ${currentQ.explanation}`;
    } else {
        selectedBtn.classList.add('incorrect');
        optionBtns[currentQ.correct].classList.add('correct'); // Highlight correct answer
        feedbackDiv.style.backgroundColor = 'var(--danger-bg)';
        feedbackDiv.style.color = 'var(--danger)';
        feedbackDiv.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong>Incorrect.</strong> ${currentQ.explanation}`;
    }

    feedbackDiv.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    questionScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScoreSpan.innerText = score;

    let msg = "";
    if (score === quizData.length) {
        msg = "🌟 Outstanding! You have expert-level awareness of QR security and digital payment safety.";
    } else if (score >= 5) {
        msg = "👍 Good job! You have a solid grasp of QR safety habits, but keep reviewing the modules.";
    } else {
        msg = "⚠️ Needs Improvement. Please go through the QR Scams and Verify Before You Trust sections to stay safe.";
    }
    performanceMsg.innerText = msg;
}

function restartQuiz() {
    startQuiz();
}
