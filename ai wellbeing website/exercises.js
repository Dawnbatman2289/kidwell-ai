// Show feedback for exercises
function showFeedback(success, message) {
    const feedback = document.createElement('div');
    feedback.className = `exercise-feedback ${success ? 'success' : 'error'}`;
    feedback.innerHTML = `
        <div class="feedback-content">
            <i class="fas ${success ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.querySelector('.exercise-content').appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
        if (success) {
            completeExercise();
        }
    }, 2000);
}

const exerciseManager = {
    // ...existing code...
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.textContent === card2.textContent;
        
        if (match) {
            this.matchedPairs++;
            if (this.matchedPairs === 8) {
                this.completeExercise();
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        this.flippedCards = [];
    }
    // ...existing code...
};

// Make functions globally available
window.exerciseManager = exerciseManager;
window.startExercise = exerciseManager.startExercise.bind(exerciseManager);
window.flipCard = exerciseManager.flipCard.bind(exerciseManager);
window.checkMathAnswer = exerciseManager.checkMathAnswer.bind(exerciseManager);
window.checkWord = exerciseManager.checkWord.bind(exerciseManager);
window.checkPattern = exerciseManager.checkPattern.bind(exerciseManager);