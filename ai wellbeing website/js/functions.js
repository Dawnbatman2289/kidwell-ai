// Make all functions globally available
window.state = {
    screenTime: {
        active: false,
        seconds: 0,
        timer: null,
        limit: 120
    },
    activities: {
        completed: 0,
        goal: 60,
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

let activities = [];
let screenTimeStarted = false;
let screenTimeInterval = null;
let startTime = null;

function navigate(section) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
}

function showActivityModal() {
    document.getElementById('activity-modal').style.display = 'block';
}

function showExerciseModal() {
    // Display the exercise modal
    document.getElementById('exercise-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function logActivity(event) {
    event.preventDefault();
    const type = document.getElementById('activity-type').value;
    const duration = parseInt(document.getElementById('activity-duration').value);
    
    if (!type || !duration) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    activities.push({
        type,
        duration,
        timestamp: new Date().toISOString()
    });

    updateActivityProgress();
    updateActivityList();
    closeModal('activity-modal');
    checkAchievements();
    showNotification('Activity logged successfully!');
}

function updateActivityProgress() {
    const totalMinutes = activities.reduce((sum, act) => sum + act.duration, 0);
    const goal = parseInt(document.getElementById('activity-goal').value) || 60;
    const progress = Math.min((totalMinutes / goal) * 100, 100);
    
    document.getElementById('activity-progress').style.width = `${progress}%`;
    document.getElementById('activity-percentage').textContent = `${totalMinutes}/${goal} min`;
}

function updateActivityList() {
    const list = document.getElementById('activity-list');
    list.innerHTML = activities.map(activity => `
        <div class="activity-entry">
            <div class="activity-info">
                <span class="activity-type">${activity.type}</span>
                <span class="activity-duration">${activity.duration} min</span>
                <span class="activity-time">${new Date(activity.timestamp).toLocaleTimeString()}</span>
            </div>
        </div>
    `).join('');
}

function toggleScreenTimeTracking() {
    if (!screenTimeStarted) {
        startTime = Date.now();
        screenTimeInterval = setInterval(updateScreenTime, 1000);
        screenTimeStarted = true;
        document.getElementById('screen-time-btn').innerHTML = '<i class="fas fa-stop"></i> Stop Tracking';
    } else {
        clearInterval(screenTimeInterval);
        screenTimeStarted = false;
        document.getElementById('screen-time-btn').innerHTML = '<i class="fas fa-play"></i> Start Tracking';
    }
}

function updateScreenTime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('screen-timer').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timeLimit = parseInt(document.getElementById('screen-time-limit').value);
    const progress = Math.min((minutes / timeLimit) * 100, 100);
    document.getElementById('screen-progress').style.width = `${progress}%`;
    document.getElementById('screen-time-percentage').textContent = `${minutes}/${timeLimit} min`;
}

function saveSettings() {
    const settings = {
        theme: document.getElementById('theme-select').value,
        screenTimeLimit: document.getElementById('screen-time-limit').value,
        activityGoal: document.getElementById('activity-goal').value,
        exerciseGoal: document.getElementById('exercise-goal').value,
        notifications: {
            screenTime: document.getElementById('screen-time-alerts').checked,
            activity: document.getElementById('activity-reminders').checked,
            exercise: document.getElementById('exercise-reminders').checked,
            achievement: document.getElementById('achievement-alerts').checked
        },
        sound: document.getElementById('notification-sound').value
    };
    
    localStorage.setItem('settings', JSON.stringify(settings));
    applyTheme(settings.theme);
    showNotification('Settings saved successfully!');
}

function applyTheme(theme) {
    document.body.className = theme;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notification-container');
    container.appendChild(notification);
    
    const sound = document.getElementById('notification-sound').value;
    playNotificationSound(sound);
    
    setTimeout(() => notification.remove(), 3000);
}

function playNotificationSound(sound) {
    if (sound === 'none') return;
    const audio = new Audio(`sounds/${sound}.mp3`);
    audio.play().catch(() => console.log('Sound playback failed'));
}

function openAIModal() {
    document.getElementById('ai-modal').style.display = 'block';
}

function askAI() {
    var input = document.getElementById('ai-input').value.trim();
    var responseDiv = document.getElementById('ai-response');
    if (!input) {
        responseDiv.innerText = "Please enter a question.";
        return;
    }
    var responses = [
        "Your well-being is important. Remember to take breaks and care for yourself!",
        "I'm here to help. Stay positive and relaxed.",
        "Balance is essential. Mix work with leisure and self-care.",
        "Take a deep breath—self-care starts with a moment of calm."
    ];
    var randomResponse = responses[Math.floor(Math.random() * responses.length)];
    responseDiv.innerText = "AI Response: " + randomResponse;
    // Use text-to-speech if available
    if ('speechSynthesis' in window) {
        var utterance = new SpeechSynthesisUtterance(randomResponse);
        window.speechSynthesis.speak(utterance);
    }
}

function clearAIChat() {
    document.getElementById('ai-input').value = "";
    document.getElementById('ai-response').innerText = "";
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', () => {
    navigate('dashboard');
    
    // Update current time
    setInterval(() => {
        const now = new Date();
        document.getElementById('current-time').textContent = 
            now.toISOString().slice(0, 19).replace('T', ' ');
    }, 1000);

    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        applyTheme(settings.theme);
        // Restore other settings
    }
});
