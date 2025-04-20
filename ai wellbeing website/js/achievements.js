const achievements = [
    {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Log your first activity',
        icon: 'walking',
        unlocked: false
    },
    {
        id: 'exercise_master',
        title: 'Exercise Master',
        description: 'Complete all daily exercises',
        icon: 'brain',
        unlocked: false
    },
    // Add more achievements
];

function updateAchievementsDisplay() {
    const container = document.getElementById('achievements-container');
    container.innerHTML = achievements.map(a => `
        <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
            <i class="fas fa-${a.icon}"></i>
            <h3>${a.title}</h3>
            <p>${a.description}</p>
        </div>
    `).join('');
}

function checkAchievements() {
    if (activities.length > 0) unlockAchievement('first_steps');
    if (completedExercises >= 4) unlockAchievement('exercise_master');
    updateAchievementsDisplay();
}

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        showNotification(`🏆 Achievement Unlocked: ${achievement.title}!`);
    }
}

// Initialize achievements display
document.addEventListener('DOMContentLoaded', updateAchievementsDisplay);
