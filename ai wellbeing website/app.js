// State management
const state = {
    screenTime: {
        active: false,
        seconds: 0,
        timer: null,
        limit: 120 // minutes
    },
    activities: {
        completed: 0,
        goal: 60, // minutes
        history: []
    },
    exercises: {
        completed: 0,
        daily_goal: 4,
        history: []
    },
    achievements: [
        { id: 1, name: "Early Bird", icon: "fa-sun", description: "Complete an exercise before 9 AM", earned: false },
        { id: 2, name: "Active Achiever", icon: "fa-medal", description: "Meet daily activity goal 5 days in a row", earned: false },
        { id: 3, name: "Mind Master", icon: "fa-brain", description: "Complete all daily cognitive exercises", earned: false },
        { id: 4, name: "Balance Builder", icon: "fa-balance-scale", description: "Maintain healthy screen time for a week", earned: false }
    ],
    settings: {
        screenTimeLimit: 120,
        activityGoal: 60,
        screenTimeAlerts: true,
        activityReminders: true
    }
};

// Enhanced navigation
function navigate(section) {
    // Hide all sections
    document.querySelectorAll('section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });

    // Show the selected section
    const selectedSection = document.getElementById(section);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active');
    }

    // Update navigation active state
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`nav a[href="#${section}"]`).classList.add('active');

    // Update content based on section
    switch (section) {
        case 'activities':
            updateActivityHistory();
            break;
        case 'achievements':
            checkAchievements();
            break;
        case 'settings':
            loadSettings();
            break;
        case 'dashboard':
            break;
    }
}

// Fix screen time tracking
function toggleScreenTimeTracking() {
    const btn = document.getElementById('screen-time-btn');
    if (!state.screenTime.active) {
        state.screenTime.active = true;
        state.screenTime.timer = setInterval(updateScreenTime, 1000);
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause Tracking';
        btn.classList.add('btn-danger');
    } else {
        state.screenTime.active = false;
        clearInterval(state.screenTime.timer);
        btn.innerHTML = '<i class="fas fa-play"></i> Resume Tracking';
        btn.classList.remove('btn-danger');
    }
    saveState();
}

function updateScreenTime() {
    state.screenTime.seconds++;
    const hours = Math.floor(state.screenTime.seconds / 3600);
    const minutes = Math.floor((state.screenTime.seconds % 3600) / 60);
    const seconds = state.screenTime.seconds % 60;
    
    document.getElementById('screen-timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update progress
    const dailyLimit = state.settings.screenTimeLimit * 60; // convert to seconds
    const progress = (state.screenTime.seconds / dailyLimit) * 100;
    document.getElementById('screen-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('screen-time-percentage').textContent = 
        `${Math.floor(state.screenTime.seconds / 60)}/${state.settings.screenTimeLimit} min`;

    // Check for alerts
    if (state.settings.screenTimeAlerts && progress >= 100) {
        alert("You've reached your daily screen time limit!");
        toggleScreenTimeTracking();
    }
}

// Physical Activity Logging
function showActivityModal() {
    document.getElementById('activity-modal').style.display = 'block';
}

// Fix activity logging
function logActivity(event) {
    event.preventDefault();
    const type = document.getElementById('activity-type').value;
    const duration = parseInt(document.getElementById('activity-duration').value);

    if (!type || duration < 5 || duration > 180) {
        alert('Please select a valid activity and duration.');
        return;
    }

    state.activities.completed += duration;
    state.activities.history.push({
        type,
        duration,
        timestamp: new Date().toISOString()
    });

    updateActivityProgress();
    closeModal('activity-modal');
    checkAchievements();
    saveState();
}

function updateActivityProgress() {
    const progress = (state.activities.completed / state.activities.goal) * 100;
    document.getElementById('activity-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('activity-percentage').textContent = 
        `${state.activities.completed}/${state.activities.goal} min`;
}

// Cognitive Exercises
const exercises = {
    memory: {
        title: "Memory Match",
        generate: () => {
            // Generate memory card matching game
            const pairs = ['🌟', '🎈', '🎭', '🎪', '🎨', '🎯', '🎲', '🎱'];
            const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
            let html = '<div class="memory-game">';
            cards.forEach((card, index) => {
                html += `<div class="memory-card" data-index="${index}" onclick="flipCard(this)">${card}</div>`;
            });
            html += '</div>';
            return html;
        }
    },
    math: {
        title: "Math Challenge",
        generate: () => {
            const num1 = Math.floor(Math.random() * 20) + 1;
            const num2 = Math.floor(Math.random() * 20) + 1;
            const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
            return `
                <div class="math-challenge">
                    <h3>${num1} ${operator} ${num2} = ?</h3>
                    <input type="number" id="math-answer">
                    <button class="btn" onclick="checkMathAnswer(${num1}, '${operator}', ${num2})">Submit</button>
                </div>
            `;
        }
    },
    puzzle: {
        title: "Pattern Puzzle",
        generate: () => {
            // Generate pattern completion puzzle
            const patterns = ['🔵⭐🔵⭐🔵❓', '🔺🔻🔺🔻🔺❓', '🟦🟨🟦🟨🟦❓'];
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            return `
                <div class="pattern-puzzle">
                    <h3>Complete the Pattern:</h3>
                    <div class="pattern">${pattern}</div>
                    <div class="options">
                        <button class="btn" onclick="checkPattern('⭐')">⭐</button>
                        <button class="btn" onclick="checkPattern('🔵')">🔵</button>
                        <button class="btn" onclick="checkPattern('🔻')">🔻</button>
                    </div>
                </div>
            `;
        }
    },
    word: {
        title: "Word Scramble",
        generate: () => {
            const words = ['HAPPY', 'LEARN', 'SMART', 'FOCUS', 'BRAIN'];
            const word = words[Math.floor(Math.random() * words.length)];
            const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
            return `
                <div class="word-scramble">
                    <h3>Unscramble the word:</h3>
                    <div class="scrambled">${scrambled}</div>
                    <input type="text" id="word-answer" maxlength="${word.length}">
                    <button class="btn" onclick="checkWord('${word}')">Submit</button>
                </div>
            `;
        }
    }
};

let flippedCards = [];
let matchedPairs = 0;

function flipCard(card) {
    if (flippedCards.length < 2 && !flippedCards.includes(card)) {
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.textContent === card2.textContent;
    
    if (match) {
        matchedPairs++;
        if (matchedPairs === 8) {
            completeExercise();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function checkMathAnswer(num1, operator, num2) {
    const answer = parseInt(document.getElementById('math-answer').value);
    let correct;
    
    switch(operator) {
        case '+': correct = num1 + num2; break;
        case '-': correct = num1 - num2; break;
        case '*': correct = num1 * num2; break;
    }
    
    if (answer === correct) {
        completeExercise();
    } else {
        showFeedback(false, 'Try again!');
    }
}

function checkWord(correctWord) {
    const answer = document.getElementById('word-answer').value.toUpperCase();
    if (answer === correctWord) {
        completeExercise();
    } else {
        showFeedback(false, 'Try again!');
    }
}

function checkPattern(answer) {
    const currentPattern = document.querySelector('.pattern').textContent;
    const correctAnswer = currentPattern.includes('⭐') ? '⭐' : 
                         currentPattern.includes('🔺') ? '🔺' : '🟦';
    
    if (answer === correctAnswer) {
        completeExercise();
    } else {
        showFeedback(false, 'Try again!');
    }
}

function showFeedback(success, message) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${success ? 'success' : 'error'}`;
    feedback.textContent = message;
    
    const modal = document.querySelector('.modal-content');
    modal.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 2000);
}

function showExerciseModal() {
    document.getElementById('exercise-modal').style.display = 'block';
}

// Fix exercise modal and start functionality
function startExercise(type) {
    const exercise = exercises[type];
    const content = document.getElementById('exercise-content');
    content.innerHTML = `
        <h3>${exercise.title}</h3>
        ${exercise.generate()}
    `;
    showExerciseModal();
}

function completeExercise() {
    state.exercises.completed++;
    updateExerciseProgress();
    closeModal('exercise-modal');
    checkAchievements();
    saveState();
}

function updateExerciseProgress() {
    const progress = (state.exercises.completed / state.exercises.daily_goal) * 100;
    document.getElementById('cognitive-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('exercise-count').textContent = 
        `${state.exercises.completed}/${state.exercises.daily_goal} completed`;
}

// Achievements
function checkAchievements() {
    const achievements = document.getElementById('achievements-container');
    achievements.innerHTML = '';
    
    state.achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = `achievement-badge ${achievement.earned ? 'earned' : ''}`;
        badge.innerHTML = `
            <i class="fas ${achievement.icon} badge-icon"></i>
            <div>
                <strong>${achievement.name}</strong>
                <div>${achievement.description}</div>
            </div>
        `;
        achievements.appendChild(badge);
    });
}

// Settings
function saveSettings() {
    state.settings.screenTimeLimit = parseInt(document.getElementById('screen-time-limit').value);
    state.settings.activityGoal = parseInt(document.getElementById('activity-goal').value);
    state.settings.screenTimeAlerts = document.getElementById('screen-time-alerts').checked;
    state.settings.activityReminders = document.getElementById('activity-reminders').checked;
    
    alert('Settings saved successfully!');
}

// Utilities
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleParentMode() {
    const password = prompt("Enter parent password:");
    if (password === "1234") { // In a real app, use proper authentication
        alert("Parent mode activated!");
        // Add parent mode functionality
    }
}

function saveState() {
    localStorage.setItem('wellbeingState', JSON.stringify({
        screenTime: {
            active: state.screenTime.active,
            seconds: state.screenTime.seconds,
            limit: state.screenTime.limit
        },
        activities: {
            completed: state.activities.completed,
            goal: state.activities.goal,
            history: state.activities.history
        },
        exercises: {
            completed: state.exercises.completed,
            daily_goal: state.exercises.daily_goal,
            history: state.exercises.history
        },
        achievements: state.achievements,
        settings: state.settings
    }));
}

function loadState() {
    const saved = localStorage.getItem('wellbeingState');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(state, data);
        updateAllDisplays();
    }
}

// Ensure all displays are updated
function updateAllDisplays() {
    updateScreenTime();
    updateActivityProgress();
    updateExerciseProgress();
    updateActivityHistory();
    checkAchievements();
}

function updateActivityHistory() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    activityList.innerHTML = state.activities.history
        .map(activity => `
            <div class="activity-item">
                <span>${activity.type}</span>
                <span>${activity.duration} minutes</span>
                <span>${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
        `)
        .join('') || '<p>No activities logged yet</p>';
}

function loadSettings() {
    document.getElementById('screen-time-limit').value = state.settings.screenTimeLimit;
    document.getElementById('activity-goal').value = state.settings.activityGoal;
    document.getElementById('screen-time-alerts').checked = state.settings.screenTimeAlerts;
    document.getElementById('activity-reminders').checked = state.settings.activityReminders;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    navigate('dashboard');
    updateAllDisplays();

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Initialize screen time display
    document.getElementById('screen-timer').textContent = '00:00:00';
    updateScreenTimeDisplay();
});