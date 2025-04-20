// Import AI assistant
import { aiAssistant } from './ai-features.js';

// Initialize state
const state = {
    screenTime: {
        isTracking: false,
        seconds: 0,
        timer: null
    },
    activities: [],
    exercises: {
        completed: 0
    },
    ai: {
        lastAnalysis: null,
        recommendations: [],
        adaptiveDifficulty: 1.0
    }
};

// Improved state management with localStorage
function saveState() {
    localStorage.setItem('wellbeingState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('wellbeingState');
    if (savedState) {
        Object.assign(state, JSON.parse(savedState));
        updateAllDisplays();
    }
}

// Enhanced navigation
function navigate(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(section);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active');
        
        // Update navigation
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        document.querySelector(`nav a[href="#${section}"]`).classList.add('active');
        
        // Update content
        switch(section) {
            case 'activities':
                updateActivityHistory();
                break;
            case 'achievements':
                checkAchievements();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }
}

function updateAllDisplays() {
    updateScreenTimeDisplay();
    updateActivityProgress();
    updateExerciseProgress();
    updateActivityHistory();
    checkAchievements();
}

// Screen Time Tracking
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

async function updateScreenTime() {
    state.screenTime.seconds++;
    updateScreenTimeDisplay();
    
    // AI analysis
    const analysis = await aiAssistant.analyzeScreenTimePatterns('user1', {
        duration: state.screenTime.seconds,
        mistakes: state.exercises.mistakes || 0
    });
    
    if (analysis.fatigueWarning) {
        showNotification("Fatigue Warning", "Consider taking a longer break!");
    }
    
    updateHealthTips(analysis.recommendation);
}

function updateScreenTimeDisplay() {
    const hours = Math.floor(state.screenTime.seconds / 3600);
    const minutes = Math.floor((state.screenTime.seconds % 3600) / 60);
    const seconds = state.screenTime.seconds % 60;
    
    document.getElementById('screen-timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const progress = (state.screenTime.seconds / (120 * 60)) * 100;
    document.getElementById('screen-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('screen-time-percentage').textContent = 
        `${Math.floor(state.screenTime.seconds / 60)}/120 min`;
    
    // Add break reminder
    if (state.screenTime.seconds > 0 && state.screenTime.seconds % (20 * 60) === 0) {
        showNotification("Time for a break!", "Look at something 20 feet away for 20 seconds.");
    }
    
    saveState();
}

// Improved notification system
function showNotification(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    }
}

// Activity Logging
function showActivityModal() {
    modalManager.show('activity-modal');
}

function closeModal(modalId) {
    modalManager.close(modalId);
}

async function logActivity(event) {
    event.preventDefault();
    
    const type = document.getElementById('activity-type').value;
    const duration = parseInt(document.getElementById('activity-duration').value);
    
    if (type && duration > 0) {
        state.activities.push({ type, duration, timestamp: new Date() });
        updateActivityProgress();
        closeModal('activity-modal');
    }
    
    const impact = await aiAssistant.analyzeActivityImpact('user1', {
        type,
        duration,
        timestamp: new Date()
    });
    
    updateActivityInsights(impact);
}

function updateActivityProgress() {
    const totalMinutes = state.activities.reduce((sum, activity) => sum + activity.duration, 0);
    const progress = (totalMinutes / 60) * 100;
    
    document.getElementById('activity-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('activity-percentage').textContent = `${totalMinutes}/60 min`;
    
    saveState();
}

// Activity history display
function updateActivityHistory() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    activityList.innerHTML = state.activities.history
        .map(activity => `
            <div class="activity-item">
                <i class="fas fa-${activity.type}"></i>
                <span>${activity.type}</span>
                <span>${activity.duration} minutes</span>
                <span>${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
        `)
        .join('') || '<p>No activities logged yet</p>';
}

// Modal management
const modalManager = {
    show(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        modal.classList.add('active');
    },
    
    close(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
};

// New AI-powered features
function updateHealthTips(tip) {
    const tipsContainer = document.getElementById('health-tips');
    if (tipsContainer) {
        tipsContainer.textContent = tip;
    }
}

function updateExerciseRecommendations(suggestion) {
    const recommendationContainer = document.getElementById('exercise-recommendations');
    if (recommendationContainer) {
        recommendationContainer.innerHTML = `
            <div class="recommendation">
                <i class="fas fa-lightbulb"></i>
                <p>Suggested next exercise: ${suggestion}</p>
            </div>
        `;
    }
}

function updateActivityInsights(impact) {
    const insightsContainer = document.getElementById('activity-insights');
    if (insightsContainer) {
        insightsContainer.innerHTML = `
            <div class="insight">
                <p>Energy Impact: ${Math.round(impact.energyImpact * 100)}%</p>
                <p>Focus Improvement: ${Math.round(impact.focusImprovement * 100)}%</p>
                <p>Suggestion: ${impact.recommendation}</p>
            </div>
        `;
    }
}

// Load settings into form
function loadSettings() {
    document.getElementById('screen-time-limit').value = state.settings.screenTimeLimit;
    document.getElementById('activity-goal').value = state.settings.activityGoal;
    document.getElementById('screen-time-alerts').checked = state.settings.screenTimeAlerts;
    document.getElementById('activity-reminders').checked = state.settings.activityReminders;
}

// Show exercise modal with content
function showExerciseModal() {
    modalManager.show('exercise-modal');
}

// Add to exercise completion
async function completeExercise(performance) {
    const aiSuggestion = await aiAssistant.adaptExerciseDifficulty('user1', 
        state.currentExercise, performance);
    
    state.ai.adaptiveDifficulty = aiSuggestion.difficulty;
    updateExerciseRecommendations(aiSuggestion.suggestion);
    
    // ...existing code...
}

// Header visibility control
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const header = document.querySelector('.header');
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            lastScrollY = window.scrollY;
            ticking = false;
        });
        ticking = true;
    }
});

// Show header on mouse near top
document.addEventListener('mousemove', (e) => {
    const header = document.querySelector('.header');
    if (e.clientY < 150) {
        header.classList.remove('hidden');
    }
});

// Initialize
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
    
    // Update current time
    setInterval(() => {
        const now = new Date();
        document.getElementById('current-time').textContent = 
            now.toISOString().slice(0, 19).replace('T', ' ');
    }, 1000);
    
    // Handle keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalManager.activeModal) {
            modalManager.close(modalManager.activeModal);
        }
    });
});