// Load Lottie Animation
document.addEventListener("DOMContentLoaded", function () {
    lottie.loadAnimation({
        container: document.getElementById("lottie-animation"), // Target container
        renderer: "svg", // Use SVG for best quality
        loop: true,
        autoplay: true,
        path: "./Animation/Animation - 1739463098104.json" // Ensure correct path
    });

    // Load facts dynamically from JSON file
    fetch("./Dataset/Facts.json")
        .then(response => response.json())
        .then(data => {
            console.log("Facts loaded successfully:", data); // Debugging output
            window.facts = data; // Store facts in a global variable
        })
        .catch(error => console.error("Error loading facts:", error));

    // Load quizzes dynamically from JSON file
    fetch("./Dataset/Quiz.json")
        .then(response => response.json())
        .then(data => {
            console.log("Quizzes loaded successfully:", data); // Debugging output
            window.fullQuizData = data; // Store all quiz data in a global variable
        })
        .catch(error => console.error("Error loading quizzes:", error));
});

// Function to Open Tabs with Animation
function openTab(category) {
    console.log(`Opening tab: ${category}`); // Debugging output

    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));

    const selectedTab = document.getElementById(category);
    selectedTab.classList.add('fade-in'); // Add fade-in effect
    selectedTab.classList.add('active');

    if (category !== 'quiz') {
        const factsContainer = document.getElementById(`${category}-facts`);
        factsContainer.innerHTML = "";

        if (!window.facts) {
            console.error("Facts data is not loaded yet.");
            factsContainer.innerHTML = "<p>Error loading facts. Please try again.</p>";
            return;
        }

        if (!window.facts.hasOwnProperty(category)) {
            console.error(`Category "${category}" not found in Facts.json`);
            factsContainer.innerHTML = `<p>No facts available for the "${category}" category.</p>`;
            return;
        }

        const categoryFacts = window.facts[category];
        if (categoryFacts.length === 0) {
            factsContainer.innerHTML = `<p>No facts available for this category.</p>`;
        } else {
            categoryFacts.forEach(fact => {
                const factDiv = document.createElement('div');
                factDiv.className = 'fact fade-in';
                factDiv.textContent = fact;
                factsContainer.appendChild(factDiv);
            });
        }
    } else {
        startQuiz(); // Start the quiz with random 10 questions
    }
}

let currentQuestionIndex = 0;
let score = 0;
let quizData = [];

// Start the Quiz with 10 Random Questions
function startQuiz() {
    quizData = getRandomQuizzes(); // Get 10 random questions
    currentQuestionIndex = 0;
    score = 0;
    loadQuizQuestion();
}

// Get 10 random quizzes
function getRandomQuizzes() {
    if (!window.fullQuizData || window.fullQuizData.length < 10) {
        console.error("Not enough quizzes available!");
        return [];
    }
    let shuffled = [...window.fullQuizData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

// Load Quiz Question with Animation
function loadQuizQuestion() {
    const questionContainer = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackContainer = document.getElementById('quiz-feedback');

    feedbackContainer.textContent = "";
    optionsContainer.innerHTML = "";

    if (currentQuestionIndex < quizData.length) {
        const currentQuestion = quizData[currentQuestionIndex];
        questionContainer.textContent = currentQuestion.question;
        questionContainer.classList.add("quiz-question", "fade-in");

        // Générer les boutons
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = "quiz-option";
            button.onclick = () => checkAnswer(button, currentQuestion.correct);
            
            optionsContainer.appendChild(button);
        });
    } else {
        showFinalScore();
    }
}



// Check Quiz Answer with Animation
function checkAnswer(button, correctAnswer) {
    const feedbackContainer = document.getElementById('quiz-feedback');
    button.classList.add("clicked");

    if (button.textContent === correctAnswer) {
        button.classList.add("correct");
        feedbackContainer.textContent = "✅ Correct!";
        score++;
    } else {
        button.classList.add("incorrect");
        feedbackContainer.textContent = `❌ Incorrect. The correct answer is: ${correctAnswer}`;
    }

    currentQuestionIndex++;
    setTimeout(loadQuizQuestion, 2000);
}

// Show Final Score at the End
function showFinalScore() {
    const questionContainer = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackContainer = document.getElementById('quiz-feedback');

    questionContainer.textContent = `🎉 Quiz Complete! Your final score is ${score}/10. 🎉`;
    questionContainer.classList.add("fade-in");
    optionsContainer.innerHTML = "";
    feedbackContainer.innerHTML = `<p>Thank you for playing! Click "Quiz" again for a new set of random questions. 🚀</p>`;
}

// Start the Journey with Animation
function startJourney() {
    const welcomePage = document.getElementById('welcome-page');
    const funFactsPage = document.getElementById('funfacts-page');

    welcomePage.classList.add("fade-out");
    setTimeout(() => {
        welcomePage.style.display = 'none';
        funFactsPage.classList.remove('hidden');
        funFactsPage.classList.add("fade-in");
        openTab('animals');
    }, 500);
}
