function toggleForms() {
    document.getElementById("loginBox").classList.toggle("active");
    document.getElementById("registerBox").classList.toggle("active");
}

// Ensure event listeners are attached after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get elements safely
    const registerLink = document.getElementById("registerLink");
    const loginLink = document.getElementById("loginLink");

    if (registerLink) {
        registerLink.addEventListener("click", function(event) {
            event.preventDefault();
            toggleForms();
        });
    }

    if (loginLink) {
        loginLink.addEventListener("click", function(event) {
            event.preventDefault();
            toggleForms();
        });
    }

    // Handle Login Form Submission
    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault();
    
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const role = document.getElementById("loginRole").value.trim(); // Get the selected role

        console.log("Login Role:", role); // Debugging - Check role before sending
    
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }) // Send role in request
            });
    
            const data = await response.json();
            console.log("Login Response:", data);
    
            if (response.ok) {
                alert(data.message);
                window.location.href = data.redirect;  // Redirect to respective page
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server. Please try again.");
        }
    });

    // Handle Register Form Submission
    document.getElementById("registerForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const role = document.getElementById("userRole").value.trim();  // Ensure role is not empty
        const phone = document.getElementById("phoneNumber").value;
        const address = document.getElementById("address").value;

        console.log("Register Role:", role); // Debugging - Check role before sending

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role, phone, address })
            });

            const data = await response.json();
            console.log("Register Response:", data);

            if (response.ok) {
                alert(data.message);
                toggleForms(); // Switch to login after registration
            } else {
                alert("Registration failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server. Please try again.");
        }
    });
});



// Add to your existing JavaScript, right after the DOMContentLoaded event listener

// Health assessment functions
let userHealthData = {};
let healthAssessmentComplete = false;

// Check if this is a new user and health assessment is needed
function checkForNewUser() {
    // In a real app, this would check your authentication system
    // For this demo, we'll use localStorage to simulate
    const hasCompletedAssessment = localStorage.getItem('healthAssessmentComplete');
    
    if (!hasCompletedAssessment) {
        // Show health assessment modal after a short delay
        setTimeout(() => {
            startHealthAssessment();
        }, 1000);
    }
}

// Start the health assessment process
function startHealthAssessment() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'health-assessment-modal';
    modalContainer.innerHTML = `
        <div class="health-assessment-content">
            <h2>Health Assessment</h2>
            <p>Please answer these 10 questions to help us understand your health status.</p>
            <div class="question-container"></div>
            <div class="assessment-navigation">
                <button class="prev-btn" disabled>Previous</button>
                <div class="progress-indicator">Question 1 of 10</div>
                <button class="next-btn">Next</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Add styles for the modal
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .health-assessment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .health-assessment-content {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            position: relative;
        }
        
        .health-assessment-content h2 {
            color: #c41e1e;
            margin-bottom: 15px;
        }
        
        .question-container {
            margin: 20px 0;
            min-height: 150px;
        }
        
        .assessment-question {
            margin-bottom: 15px;
        }
        
        .assessment-question label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .assessment-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
        }
        
        .assessment-navigation button {
            background-color: #c41e1e;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .assessment-navigation button:hover {
            background-color: #a61a1a;
        }
        
        .assessment-navigation button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        
        .progress-indicator {
            font-size: 14px;
            color: #666;
        }
        
        .health-result {
            text-align: center;
            padding: 20px;
        }
        
        .health-result h3 {
            margin-bottom: 15px;
            color: #c41e1e;
        }
        
        .health-score {
            font-size: 48px;
            font-weight: 700;
            color: #333;
            margin: 20px 0;
        }
        
        .health-recommendations {
            text-align: left;
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f8f8;
            border-radius: 8px;
        }
        
        .health-recommendations h4 {
            margin-bottom: 10px;
        }
        
        .health-recommendations ul {
            padding-left: 20px;
        }
        
        .health-recommendations li {
            margin-bottom: 8px;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Start with the first question
    showHealthQuestion(0);
}

// Health assessment questions
const healthQuestions = [
    {
        id: 'sleep',
        question: 'How many hours of sleep do you get on average per night?',
        type: 'radio',
        options: [
            { value: '1', label: 'Less than 5 hours' },
            { value: '2', label: '5-6 hours' },
            { value: '3', label: '7-8 hours' },
            { value: '4', label: 'More than 8 hours' }
        ]
    },
    {
        id: 'exercise',
        question: 'How often do you exercise per week?',
        type: 'radio',
        options: [
            { value: '1', label: 'Rarely or never' },
            { value: '2', label: '1-2 times' },
            { value: '3', label: '3-4 times' },
            { value: '4', label: '5 or more times' }
        ]
    },
    {
        id: 'water',
        question: 'How many glasses of water do you drink daily?',
        type: 'radio',
        options: [
            { value: '1', label: 'Less than 3 glasses' },
            { value: '2', label: '3-5 glasses' },
            { value: '3', label: '6-8 glasses' },
            { value: '4', label: 'More than 8 glasses' }
        ]
    },
    {
        id: 'meals',
        question: 'How many balanced meals do you eat per day?',
        type: 'radio',
        options: [
            { value: '1', label: '1 meal or less' },
            { value: '2', label: '2 meals' },
            { value: '3', label: '3 meals' },
            { value: '4', label: '3 meals with healthy snacks' }
        ]
    },
    {
        id: 'stress',
        question: 'How would you rate your stress level?',
        type: 'radio',
        options: [
            { value: '1', label: 'Very high stress' },
            { value: '2', label: 'Moderate stress' },
            { value: '3', label: 'Low stress' },
            { value: '4', label: 'Very minimal stress' }
        ]
    },
    {
        id: 'screenTime',
        question: 'How many hours do you spend on digital screens daily?',
        type: 'radio',
        options: [
            { value: '4', label: 'Less than 2 hours' },
            { value: '3', label: '2-4 hours' },
            { value: '2', label: '4-8 hours' },
            { value: '1', label: 'More than 8 hours' }
        ]
    },
    {
        id: 'fruits',
        question: 'How often do you eat fruits and vegetables?',
        type: 'radio',
        options: [
            { value: '1', label: 'Rarely or never' },
            { value: '2', label: 'A few times a week' },
            { value: '3', label: 'Once daily' },
            { value: '4', label: 'Multiple times daily' }
        ]
    },
    {
        id: 'meditation',
        question: 'Do you practice mindfulness or meditation?',
        type: 'radio',
        options: [
            { value: '1', label: 'Never' },
            { value: '2', label: 'Occasionally' },
            { value: '3', label: 'Weekly' },
            { value: '4', label: 'Daily' }
        ]
    },
    {
        id: 'smoking',
        question: 'Do you smoke or use tobacco products?',
        type: 'radio',
        options: [
            { value: '1', label: 'Daily' },
            { value: '2', label: 'Occasionally' },
            { value: '3', label: 'Rarely' },
            { value: '4', label: 'Never' }
        ]
    },
    {
        id: 'alcohol',
        question: 'How often do you consume alcoholic beverages?',
        type: 'radio',
        options: [
            { value: '1', label: 'Daily' },
            { value: '2', label: 'Several times per week' },
            { value: '3', label: 'Occasionally' },
            { value: '4', label: 'Rarely or never' }
        ]
    }
];

// Show a specific health question
function showHealthQuestion(index) {
    const questionContainer = document.querySelector('.question-container');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const progressIndicator = document.querySelector('.progress-indicator');
    
    // Update navigation buttons
    prevButton.disabled = index === 0;
    nextButton.textContent = index === healthQuestions.length - 1 ? 'Finish' : 'Next';
    
    // Update progress indicator
    progressIndicator.textContent = `Question ${index + 1} of ${healthQuestions.length}`;
    
    // Create the question
    const question = healthQuestions[index];
    let questionHTML = '';
    
    if (question.type === 'radio') {
        questionHTML = `
            <div class="assessment-question" data-id="${question.id}">
                <label>${question.question}</label>
                <div class="options-container">
                    ${question.options.map(option => `
                        <div class="option">
                            <input type="radio" id="${question.id}_${option.value}" 
                                name="${question.id}" value="${option.value}" 
                                ${userHealthData[question.id] === option.value ? 'checked' : ''}>
                            <label for="${question.id}_${option.value}">${option.label}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    questionContainer.innerHTML = questionHTML;
    
    // Set up navigation event listeners
    prevButton.onclick = () => {
        saveCurrentAnswer(index);
        showHealthQuestion(index - 1);
    };
    
    nextButton.onclick = () => {
        if (saveCurrentAnswer(index)) {
            if (index === healthQuestions.length - 1) {
                completeAssessment();
            } else {
                showHealthQuestion(index + 1);
            }
        }
    };
}

// Save the current answer
function saveCurrentAnswer(index) {
    const question = healthQuestions[index];
    const selectedOption = document.querySelector(`input[name="${question.id}"]:checked`);
    
    if (!selectedOption) {
        alert('Please select an answer before continuing.');
        return false;
    }
    
    userHealthData[question.id] = selectedOption.value;
    return true;
}

// Complete the health assessment
function completeAssessment() {
    // Calculate health score
    let totalScore = 0;
    let totalQuestions = 0;
    
    for (const key in userHealthData) {
        totalScore += parseInt(userHealthData[key], 10);
        totalQuestions++;
    }
    
    const averageScore = Math.round((totalScore / totalQuestions) * 25);
    const healthStatus = getHealthStatus(averageScore);
    
    // Save completion status
    localStorage.setItem('healthAssessmentComplete', 'true');
    localStorage.setItem('healthScore', averageScore.toString());
    localStorage.setItem('healthStatus', healthStatus.status);
    
    // Show results
    const questionContainer = document.querySelector('.question-container');
    const navigationContainer = document.querySelector('.assessment-navigation');
    
    questionContainer.innerHTML = `
        <div class="health-result">
            <h3>Your Health Assessment Results</h3>
            <div class="health-score">${averageScore}%</div>
            <p>${healthStatus.status}: ${healthStatus.description}</p>
            <div class="health-recommendations">
                <h4>Recommendations:</h4>
                <ul>
                    ${healthStatus.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    navigationContainer.innerHTML = `
        <button class="close-assessment-btn">Close</button>
    `;
    
    document.querySelector('.close-assessment-btn').addEventListener('click', () => {
        document.querySelector('.health-assessment-modal').remove();
        
        // Create or update user profile section
        updateUserProfileWithHealth(averageScore, healthStatus);
    });
    
    healthAssessmentComplete = true;
}

// Get health status based on score
function getHealthStatus(score) {
    if (score >= 85) {
        return {
            status: 'Excellent',
            description: 'You have excellent health habits!',
            recommendations: [
                'Maintain your current healthy lifestyle',
                'Consider becoming a health ambassador to help others',
                'Keep up with regular medical check-ups'
            ]
        };
    } else if (score >= 70) {
        return {
            status: 'Good',
            description: 'You have good health habits with some room for improvement.',
            recommendations: [
                'Focus on areas where you scored lower',
                'Consider adding more physical activity to your routine',
                'Ensure youre getting consistent quality sleep'
            ]
        };
    } else if (score >= 50) {
        return {
            status: 'Fair',
            description: 'You have some healthy habits, but there are several areas for improvement.',
            recommendations: [
                'Create a plan to improve your diet and exercise routine',
                'Consider reducing screen time and increasing physical activity',
                'Implement stress management techniques daily'
            ]
        };
    } else {
        return {
            status: 'Needs Improvement',
            description: 'Your health habits need significant improvement.',
            recommendations: [
                'Consult with a healthcare professional for personalized advice',
                'Start with small, manageable changes to your daily routine',
                'Focus on improving sleep, hydration, and regular meals',
                'Consider seeking support for stress management'
            ]
        };
    }
}

// Update user profile with health information
function updateUserProfileWithHealth(score, healthStatus) {
    // Check if sidebar has user info section already
    let userInfoSection = document.querySelector('.user-info');
    
    if (userInfoSection) {
        // Create health info div if it doesn't exist
        let healthInfoDiv = document.querySelector('.health-info');
        if (!healthInfoDiv) {
            healthInfoDiv = document.createElement('div');
            healthInfoDiv.className = 'health-info';
            userInfoSection.appendChild(healthInfoDiv);
        }
        
        // Add health status to profile
        healthInfoDiv.innerHTML = `
            <h4>Health Status</h4>
            <div class="health-status-indicator ${healthStatus.status.toLowerCase().replace(' ', '-')}">
                ${healthStatus.status} (${score}%)
            </div>
            <div class="health-tip">
                Tip: ${healthStatus.recommendations[0]}
            </div>
            <button class="view-health-details">View Details</button>
        `;
        
        // Add style for health info
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .health-info {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #eaeaea;
            }
            
            .health-info h4 {
                font-size: 14px;
                text-transform: uppercase;
                color: #888;
                margin-bottom: 10px;
                letter-spacing: 0.5px;
            }
            
            .health-status-indicator {
                padding: 6px 12px;
                border-radius: 20px;
                display: inline-block;
                font-weight: 600;
                margin-bottom: 10px;
                font-size: 14px;
                color: white;
            }
            
            .excellent {
                background-color: #4CAF50;
            }
            
            .good {
                background-color: #8BC34A;
            }
            
            .fair {
                background-color: #FFC107;
                color: #333;
            }
            
            .needs-improvement {
                background-color: #FF5722;
            }
            
            .health-tip {
                font-size: 13px;
                color: #666;
                margin-bottom: 15px;
                font-style: italic;
            }
            
            .view-health-details {
                background-color: #f8e4e4;
                color: #c41e1e;
                border: 1px solid #f0cdcd;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .view-health-details:hover {
                background-color: #f0cdcd;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Add click handler for view details button
        document.querySelector('.view-health-details').addEventListener('click', () => {
            showHealthDetails(score, healthStatus);
        });
    }
}

// Show detailed health information
function showHealthDetails(score, healthStatus) {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'health-details-modal';
    modalContainer.innerHTML = `
        <div class="health-details-content">
            <h2>Your Health Assessment Details</h2>
            <div class="health-score-details">
                <div class="score-circle">
                    <svg viewBox="0 0 36 36">
                        <path class="score-circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            stroke-width="3"
                        />
                        <path class="score-circle-progress"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="${getScoreColor(score)}"
                            stroke-width="3"
                            stroke-dasharray="${score}, 100"
                        />
                        <text x="18" y="20.5" class="score-text">${score}%</text>
                    </svg>
                </div>
                <div class="status-details">
                    <h3>${healthStatus.status}</h3>
                    <p>${healthStatus.description}</p>
                </div>
            </div>
            <div class="health-recommendations-detailed">
                <h4>Personalized Recommendations</h4>
                <ul>
                    ${healthStatus.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            <button class="close-details-btn">Close</button>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Add styles for health details modal
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .health-details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        
        .health-details-content {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .health-details-content h2 {
            color: #c41e1e;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .health-score-details {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
        }
        
        .score-circle {
            width: 120px;
            height: 120px;
            margin-right: 20px;
        }
        
        .score-text {
            font-size: 10px;
            text-anchor: middle;
            fill: #333;
            font-weight: bold;
        }
        
        .status-details h3 {
            margin-bottom: 10px;
            color: ${getScoreColor(score)};
        }
        
        .health-recommendations-detailed {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .health-recommendations-detailed h4 {
            margin-bottom: 15px;
            color: #333;
        }
        
        .health-recommendations-detailed ul {
            padding-left: 20px;
        }
        
        .health-recommendations-detailed li {
            margin-bottom: 10px;
            line-height: 1.5;
        }
        
        .close-details-btn {
            background-color: #c41e1e;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: block;
            margin: 0 auto;
        }
        
        .close-details-btn:hover {
            background-color: #a61a1a;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Add event listener for close button
    document.querySelector('.close-details-btn').addEventListener('click', () => {
        document.querySelector('.health-details-modal').remove();
    });
}

// Get color based on score
function getScoreColor(score) {
    if (score >= 85) return '#4CAF50'; // Excellent - Green
    if (score >= 70) return '#8BC34A'; // Good - Light Green
    if (score >= 50) return '#FFC107'; // Fair - Yellow
    return '#FF5722'; // Needs Improvement - Orange/Red
}

// Call this function at page load to check for new users
document.addEventListener("DOMContentLoaded", () => {
    loadChatHistory();
    initializeAnimations();
    enhanceUserInterface();
    checkForNewUser(); // Add this line to run the health assessment check
});